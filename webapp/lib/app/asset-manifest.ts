/* ============================================================
   Mood Builder — 渲染图层合成器(manifest)
   引擎只决定"用哪些层、怎么叠";画面全用渲染图。
   真分层图库(public/renders/library/)就位前,用现有三张全幅图占位。
   图库到位后:把 LIBRARY_READY 改成 true,逻辑不用动。
   规范见根目录 RENDER-ASSET-SPEC.md。
   ============================================================ */

import type { EmotionKey, WeatherMode } from "@/lib/engine/types";

/** 真分层图库是否已就位(图库导出后改 true,逻辑不动) */
export const LIBRARY_READY: boolean = false;

/** 占位:现有三张全幅等距渲染图,按情绪气质映射 */
const ISO_PLACEHOLDER: Record<EmotionKey, string> = {
  joyful: "/renders/space-iso-lush.png",
  calm: "/renders/space-iso-lush.png",
  confident: "/renders/space-iso-detail.png",
  mad: "/renders/space-iso-detail.png",
  sad: "/renders/space-iso-open.png",
  scared: "/renders/space-iso-open.png",
};

export type Intensity = 1 | 2 | 3;

export interface ComposeInput {
  emotion: EmotionKey;
  intensity: Intensity;
  /** 0..1 情绪起伏跨度 → 平台大小/规整度 */
  volatility: number;
  weather: WeatherMode;
}

function platformSize(v: number): "s" | "m" | "l" {
  return v < 0.25 ? "s" : v < 0.6 ? "m" : "l";
}
function regularity(v: number): "clean" | "broken" {
  return v < 0.5 ? "clean" : "broken";
}
/** 人物/尺度层密度(P46 的尺度感来自人):社交型情绪人多,收敛型人少 */
function peopleDensity(e: EmotionKey): "sparse" | "medium" | "busy" {
  if (e === "joyful" || e === "confident") return "busy";
  if (e === "calm") return "medium";
  return "sparse"; // sad / scared / mad
}

/** 把分数映射到强度档(建筑高耸/繁复程度) */
export function intensityFromScore(score: number): Intensity {
  return score < 0.4 ? 1 : score < 0.7 ? 2 : 3;
}

/**
 * 返回从后到前的图层 src 数组,交给渲染器原样堆叠。
 * - 占位期:只回一张全幅渲染图。
 * - 图库就位:回 [地块, 建筑, 植被, 天气] 四层。
 */
export function composeLayers(input: ComposeInput): string[] {
  if (!LIBRARY_READY) return [ISO_PLACEHOLDER[input.emotion] ?? ISO_PLACEHOLDER.calm];
  const size = platformSize(input.volatility);
  const reg = regularity(input.volatility);
  const veg = input.volatility > 0.5 ? "lush" : "medium";
  return [
    `/renders/library/platform-${size}-${reg}.png`,
    `/renders/library/building-${input.emotion}-${input.intensity}.png`,
    `/renders/library/veg-${veg}.png`,
    `/renders/library/people-${peopleDensity(input.emotion)}.png`,
    `/renders/library/weather-${input.weather}.png`,
  ];
}

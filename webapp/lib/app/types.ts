/* ============================================================
   Mood Builder — App 端数据模型(记录 / 当日 / 周平台)
   引擎产 reading+params;这里负责"时间"维度的聚合。
   ============================================================ */

import type { AffectReading, EmotionKey, SpaceParameters } from "@/lib/engine/types";

/** 一次记录(用户一次 check-in) */
export interface CheckIn {
  id: string;
  ts: number; // epoch ms
  seed: number;
  date: string; // 本地 YYYY-MM-DD
  source: "wheel" | "text" | "pick";
  reading: AffectReading;
  params: SpaceParameters;
  note?: string;
  physio?: {
    hrv?: number;
    restingHr?: number;
    eda?: number;
    motion?: number;
  };
}

/** 当日空间:一天内若干次记录聚合 */
export interface DaySpace {
  date: string;
  checkIns: CheckIn[];
  meanScore: number;
  volatility: number; // 0..1 当日内部起伏
  dominant: EmotionKey;
  emotionLabel: string;
}

/** 周平台:一周(≤7 天)融合成一个平台 */
export interface WeekPlatform {
  weekKey: string; // 例 2026-W27
  startDate: string;
  days: DaySpace[];
  volatility: number; // 0..1 全周起伏跨度 → 平台大小/规整度
  dominant: EmotionKey;
  emotionLabel: string;
}

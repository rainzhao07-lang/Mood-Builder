/* ============================================================
   Mood Builder — 天气推导(情绪场 → 天气)
   天气是"心情的环境呈现",由情绪向量(energy 唤醒 × pleasantness 愉悦)
   推出,与翻译数据库的锚点一致:
     愉悦高 → 晴(唤醒高)/ 多云(唤醒低,buffered inward)
     不悦   → 暴风(唤醒高,release/threat)/ 雨(中,gloom)/ 雪(极低,time frozen)
   见 translation-db 的 ATMOSPHERE(sky / water / storm)。
   纯函数,无 three 依赖,供 /app 与 3D 场景共用。
   ============================================================ */

import type { WeatherMode } from "./types";

export function weatherFromReading(energy: number, pleasantness: number): WeatherMode {
  if (pleasantness >= 0.55) return energy >= 0.5 ? "clear" : "cloudy";
  if (energy >= 0.58) return "storm";
  if (energy >= 0.22) return "rain";
  return "snow";
}

export const WEATHER_LABEL: Record<WeatherMode, string> = {
  clear: "Clear",
  cloudy: "Cloudy",
  rain: "Rain",
  storm: "Storm",
  snow: "Snow",
};

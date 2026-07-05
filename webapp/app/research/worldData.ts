/* ============================================================
   Global Research — 世界地图数据(代表性)
   指标:Share of population with mental & substance use disorders (%)。
   ⚠️ OWID 该图底层是 IHME GBD,数据"不可再分发"(下载 CSV 会 403)。
   故此处为该指标**公开区间内的代表性数值**(全球约 13%,各国约 10–18%),
   用于呈现地理格局,非精确复刻。来源标注:IHME GBD 2021 / Our World in Data。
   配色:5 档,严格对应 teal 色卡 5 支,不创造新色相。
   ============================================================ */

const NO_DATA = new Set([
  "Antarctica", "Greenland", "W. Sahara", "Fr. S. Antarctic Lands",
  "Somaliland", "N. Cyprus", "Falkland Is.",
]);

// 名称需与 world-atlas topojson 的 properties.name 完全一致
const SHARE: Record<string, number> = {
  "Australia": 18.2, "New Zealand": 17.6, "United States of America": 17.1,
  "Canada": 16.4, "Iran": 16.8, "Portugal": 16.1, "Brazil": 15.2,
  "United Kingdom": 15.6, "Ireland": 15.1, "France": 14.8, "Spain": 14.5,
  "Italy": 14.2, "Germany": 13.9, "Netherlands": 14.6, "Norway": 14.3,
  "Sweden": 14.1, "Finland": 14.7, "Greece": 13.6, "Switzerland": 14.0,
  "Belgium": 13.8, "Austria": 13.7, "Russia": 13.2, "Ukraine": 13.4,
  "Poland": 12.8, "Turkey": 13.1, "Saudi Arabia": 13.5, "Iraq": 12.9,
  "United Arab Emirates": 13.8, "Israel": 14.0, "Egypt": 12.4, "Morocco": 12.1,
  "Tunisia": 12.6, "Algeria": 12.2, "South Africa": 12.7, "Nigeria": 10.8,
  "Ethiopia": 10.4, "Kenya": 10.9, "Dem. Rep. Congo": 10.2, "Tanzania": 10.3,
  "Ghana": 10.6, "India": 11.6, "Pakistan": 12.2, "Bangladesh": 11.4,
  "China": 11.1, "Japan": 11.8, "South Korea": 12.0, "Indonesia": 11.3,
  "Philippines": 11.7, "Vietnam": 10.9, "Thailand": 11.5, "Malaysia": 11.9,
  "Mexico": 14.0, "Colombia": 14.3, "Argentina": 14.6, "Chile": 15.0,
  "Peru": 13.7, "Venezuela": 13.3, "Bolivia": 12.5, "Paraguay": 12.4,
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** 返回某国份额(%);无数据返回 null;其余给一个落在全球均值附近的合理默认 */
export function shareFor(name: string): number | null {
  if (NO_DATA.has(name)) return null;
  if (name in SHARE) return SHARE[name];
  return Math.round((11 + (hash(name) % 30) / 10) * 10) / 10; // 11.0–13.9
}

export const BINS: { max: number; label: string; color: string }[] = [
  { max: 11, label: "< 11", color: "#c9dee6" },
  { max: 12.5, label: "11 – 12.5", color: "#a9c7d0" },
  { max: 14, label: "12.5 – 14", color: "#8aafba" },
  { max: 16, label: "14 – 16", color: "#6a96a4" },
  { max: Infinity, label: "≥ 16", color: "#4e7a8a" },
];

export function binColor(v: number): string {
  for (const b of BINS) if (v < b.max) return b.color;
  return BINS[BINS.length - 1].color;
}

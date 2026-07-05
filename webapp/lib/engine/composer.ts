/* ============================================================
   Mood Builder — Spatial State Engine / Composer
   parameters → 空间原型(archetype)→ 布局 → 几何。
   六种情绪 = 六种空间逻辑:广场 / 庭院 / 尖塔峡谷 / 沉重围合 / 碎裂场。
   带碰撞避让,建筑互不重叠(修穿模)。
   ============================================================ */

import { EMOTION_DB } from "./translation-db";
import {
  EMOTION_KEYS,
  type ComposedSpace,
  type EmotionKey,
  type MassingBlock,
  type SpaceArchetype,
  type SpaceParameters,
  type VegetationInstance,
  type WeatherMode,
} from "./types";

const WEATHER_MODES: WeatherMode[] = ["clear", "cloudy", "rain", "storm", "snow"];
const VEGETATION_KINDS: VegetationInstance["kind"][] = ["pine", "blossom", "shrub", "canna"];
const DEFAULT_EMOTION: EmotionKey = "calm";

const ARCHETYPE: Record<EmotionKey, SpaceArchetype> = {
  confident: "plaza",
  joyful: "plaza",
  calm: "court",
  scared: "towers",
  sad: "enclosure",
  mad: "field",
};

/** 每种情绪一组协调的材质(混搭,楼与楼可不同;名称需被渲染器 materialKind 识别) */
const MATERIAL_PALETTE: Record<EmotionKey, string[]> = {
  confident: ["Marble", "Granite", "Steel / Iron"],
  calm: ["Wood", "Granite", "Marble"],
  joyful: ["Marble", "Wood", "Glass"],
  scared: ["Steel / Iron", "Granite", "Glass"],
  sad: ["Concrete", "Granite", "Steel / Iron"],
  mad: ["Steel / Iron", "Glass", "Concrete"],
};

type RawSpaceParameters = Partial<Record<keyof SpaceParameters, unknown>>;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeSeed(...parts: (string | number)[]): number {
  const str = parts.join("|");
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function clamp(value: unknown, fallback = 0, lo = 0, hi = 1): number {
  const n = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.max(lo, Math.min(hi, n));
}

function clampInt(value: unknown, fallback: number, lo: number, hi: number): number {
  return Math.round(clamp(value, fallback, lo, hi));
}

function stringOr(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function isEmotionKey(value: unknown): value is EmotionKey {
  return typeof value === "string" && (EMOTION_KEYS as readonly string[]).includes(value);
}

function isWeatherMode(value: unknown): value is WeatherMode {
  return typeof value === "string" && (WEATHER_MODES as readonly string[]).includes(value);
}

function sanitizeVegetationKinds(value: unknown, fallback: VegetationInstance["kind"][]) {
  if (!Array.isArray(value)) return fallback;
  const kinds = value.filter((item): item is VegetationInstance["kind"] =>
    typeof item === "string" && (VEGETATION_KINDS as readonly string[]).includes(item)
  );
  return kinds.length > 0 ? kinds : fallback;
}

export function sanitizeSpaceParameters(input: SpaceParameters): SpaceParameters {
  const raw = input as RawSpaceParameters;
  const emotion = isEmotionKey(raw.emotion) ? raw.emotion : DEFAULT_EMOTION;
  const defaults = EMOTION_DB[emotion];

  return {
    emotion,
    emotionLabel: stringOr(raw.emotionLabel, defaults.label),
    energy: clamp(raw.energy, defaults.energy),
    pleasantness: clamp(raw.pleasantness, defaults.pleasantness),
    score: clamp(raw.score, 0.5),
    vegetationDensity: clamp(raw.vegetationDensity, defaults.vegetation.density),
    vegetationKinds: sanitizeVegetationKinds(raw.vegetationKinds, defaults.vegetation.kinds),
    material: stringOr(raw.material, defaults.material.name),
    architectureStyle: stringOr(raw.architectureStyle, defaults.architectureStyle),
    roofForm: stringOr(raw.roofForm, defaults.roofForm),
    verticality: clamp(raw.verticality, defaults.verticality),
    massingComplexity: clamp(raw.massingComplexity, defaults.massingComplexity),
    circulationTurns: clampInt(raw.circulationTurns, 2 + defaults.circulationTurns * 7, 2, 9),
    lightSource: stringOr(raw.lightSource, defaults.light.source),
    lightWarmth: clamp(raw.lightWarmth, defaults.light.warmth),
    lightIntensity: clamp(raw.lightIntensity, defaults.light.intensity),
    weather: stringOr(raw.weather, defaults.weather),
    weatherMode: isWeatherMode(raw.weatherMode) ? raw.weatherMode : "cloudy",
    sound: stringOr(raw.sound, defaults.sound.source),
    paletteAccent: stringOr(raw.paletteAccent, defaults.accent),
    behaviorCue: stringOr(raw.behaviorCue, defaults.behaviorCue),
  };
}

export function composeSpace(params: SpaceParameters, seed: number): ComposedSpace {
  const p = sanitizeSpaceParameters(params);
  const safeSeed = Number.isFinite(seed)
    ? seed
    : makeSeed(p.emotion, Math.round(p.score * 1000), p.weatherMode);
  const rng = mulberry32(safeSeed);
  const R = () => rng();
  const archetype = ARCHETYPE[p.emotion];
  const heightScale = 0.3 + p.verticality * 4.8;
  const palette = MATERIAL_PALETTE[p.emotion];
  const primaryMat = palette[0] ?? p.material;
  const pickMat = (): string => {
    if (R() < 0.5) return primaryMat; // 主料占多数,其余点缀
    const idx = 1 + Math.floor(R() * Math.max(1, palette.length - 1));
    return palette[idx] ?? primaryMat;
  };

  const blocks: MassingBlock[] = [];
  const placed: { x: number; z: number; w: number; d: number }[] = [];
  const fits = (x: number, z: number, w: number, d: number, gap = 0.5) =>
    placed.every((o) => Math.abs(x - o.x) >= (w + o.w) / 2 + gap || Math.abs(z - o.z) >= (d + o.d) / 2 + gap);
  const add = (b: MassingBlock) => {
    blocks.push(b);
    placed.push({ x: b.x, z: b.z, w: b.w, d: b.d });
  };
  const tryAdd = (
    x: number,
    z: number,
    w: number,
    d: number,
    h: number,
    kind: MassingBlock["kind"],
    rot: number,
    gap = 0.5
  ): boolean => {
    if (!fits(x, z, w, d, gap) || blocks.length >= 20) return false;
    add({ x, z, w, d: kind === "spire" ? Math.min(d, 0.9) : d, h, kind, tone: R(), rot, material: pickMat() });
    return true;
  };

  if (archetype === "plaza") {
    // 中央留空的市民广场:四边环列建筑,古典/明亮
    const longXs = [-3.2, 0, 3.2];
    for (const z of [-3.1, 3.1]) {
      for (const x of longXs) {
        const w = lerp(1.1, 1.7, R());
        const d = lerp(1.0, 1.4, R());
        tryAdd(x + (R() - 0.5) * 0.4, z, w, d, heightScale * (0.5 + R() * 0.45), "mass", (R() - 0.5) * 0.04, 0.55);
      }
    }
    for (const x of [-4.6, 4.6]) {
      for (const z of [-1.6, 1.6]) {
        const w = lerp(1.0, 1.4, R());
        const d = lerp(1.1, 1.6, R());
        tryAdd(x, z + (R() - 0.5) * 0.4, w, d, heightScale * (0.55 + R() * 0.5), "mass", (R() - 0.5) * 0.04, 0.55);
      }
    }
  } else if (archetype === "court") {
    // 三面围合的庭院,前侧开敞,中央水/园(SpaceScene 补)
    for (const x of [-3.0, -1.0, 1.0, 3.0]) {
      tryAdd(x, -3.0, lerp(1.0, 1.5, R()), lerp(1.0, 1.3, R()), heightScale * (0.5 + R() * 0.4), "mass", (R() - 0.5) * 0.05, 0.5);
    }
    for (const z of [-1.4, 0.6]) {
      tryAdd(-4.4, z, 1.2, 1.4, heightScale * (0.5 + R() * 0.4), "mass", 0, 0.5);
      tryAdd(4.4, z, 1.2, 1.4, heightScale * (0.5 + R() * 0.4), "mass", 0, 0.5);
    }
  } else if (archetype === "towers") {
    // 尖塔峡谷:两列高瘦尖塔夹一条中轴走廊
    const rows = [-1.5, 1.5];
    const zs = [-3.4, -1.7, 0, 1.7, 3.4];
    for (const baseX of rows) {
      for (const z of zs) {
        const x = baseX + (R() - 0.5) * 0.5;
        const w = lerp(0.6, 0.95, R());
        tryAdd(x, z + (R() - 0.5) * 0.4, w, w, heightScale * (1.15 + R() * 1.25), "spire", (R() - 0.5) * 0.12, 0.35);
      }
    }
  } else if (archetype === "enclosure") {
    // 沉重围合:低矮厚重的长墙半包一个下沉空场,留一个缺口
    const walls: [number, number, number, number][] = [
      [0, -3.0, 8.5, 1.0],
      [-3.6, 1.2, 1.0, 4.2],
      [3.6, 1.2, 1.0, 4.2],
      [-2.4, 3.4, 3.4, 1.0],
    ];
    for (const [x, z, w, d] of walls) {
      tryAdd(x, z, w, d, heightScale * (0.7 + R() * 0.4) + 0.2, "slab", (R() - 0.5) * 0.03, 0.35);
    }
    tryAdd(1.6, 1.4, 1.6, 1.4, heightScale * 0.9 + 0.3, "mass", 0.04, 0.4);
  } else {
    // field(狂躁):碰撞错动的碎裂场
    const target = 10;
    let attempts = 0;
    while (blocks.length < target && attempts < 120) {
      attempts += 1;
      const x = (R() - 0.5) * 9.4;
      const z = (R() - 0.5) * 6.4;
      const w = lerp(0.9, 1.9, R());
      const d = lerp(0.9, 1.9, R());
      const roll = R();
      const kind: MassingBlock["kind"] = roll < 0.28 ? "arch" : roll < 0.42 ? "ruin" : "mass";
      const h = (kind === "ruin" ? 0.7 : 1) * heightScale * (0.5 + R() * 0.95);
      tryAdd(x, z, w, d, h, kind, (R() - 0.5) * 1.3, 0.42);
    }
  }

  // ---- 植被(广场/庭院把绿植推到边缘,保中央空) ----
  const vegetation: VegetationInstance[] = [];
  const vegCount = clampInt(p.vegetationDensity * 16, 0, 0, 24);
  const keepCenterClear = archetype === "plaza" || archetype === "court";
  for (let i = 0; i < vegCount; i++) {
    let x = (R() - 0.5) * 10.5;
    let z = (R() - 0.5) * 6.5;
    if (keepCenterClear && Math.abs(x) < 2.4 && Math.abs(z) < 1.8) {
      x += x >= 0 ? 2.6 : -2.6;
      z += z >= 0 ? 1.6 : -1.6;
    }
    const kind = p.vegetationKinds[i % p.vegetationKinds.length] ?? "shrub";
    vegetation.push({ x, z, scale: lerp(0.6, 1.25, R()), kind });
  }

  // ---- 流线 ----
  const turns = clampInt(p.circulationTurns, 4, 2, 9);
  const steps = clampInt(turns + 1, 5, 3, 12);
  const path: { x: number; z: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = lerp(-5.2, 5.2, t);
    const wobble = Math.sin(t * Math.PI * turns) * lerp(0.4, 2.6, p.massingComplexity * 0.5 + (turns > 5 ? 0.5 : 0));
    const z = wobble + (R() - 0.5) * 0.5;
    path.push({ x, z });
  }

  return { params: p, archetype, materials: palette, blocks, vegetation, path, seed: safeSeed };
}

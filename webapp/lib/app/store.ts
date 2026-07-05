import { EMOTION_DB } from "@/lib/engine/translation-db";
import {
  EMOTION_KEYS,
  type AffectReading,
  type EmotionKey,
  type EmotionVector,
  type SpaceParameters,
  type WeatherMode,
} from "@/lib/engine/types";
import { makeSeed } from "@/lib/engine/composer";
import type { CheckIn, DaySpace, WeekPlatform } from "./types";

const KEY = "moodbuilder.checkins.v1";
const SOURCES = ["wheel", "text", "pick"] as const;
const WEATHER_MODES: WeatherMode[] = ["clear", "cloudy", "rain", "storm", "snow"];
const VEGETATION_KINDS: SpaceParameters["vegetationKinds"] = ["pine", "blossom", "shrub", "canna"];

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function stringOr(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function clamp(value: unknown, fallback = 0, lo = 0, hi = 1): number {
  const n = isFiniteNumber(value) ? value : fallback;
  return Math.max(lo, Math.min(hi, n));
}

function clampInt(value: unknown, fallback: number, lo: number, hi: number): number {
  return Math.round(clamp(value, fallback, lo, hi));
}

function isEmotionKey(value: unknown): value is EmotionKey {
  return typeof value === "string" && (EMOTION_KEYS as readonly string[]).includes(value);
}

function isWeatherMode(value: unknown): value is WeatherMode {
  return typeof value === "string" && (WEATHER_MODES as readonly string[]).includes(value);
}

function toEmotionVector(value: unknown): EmotionVector | null {
  if (!isRecord(value)) return null;
  const vector = {} as EmotionVector;
  for (const key of EMOTION_KEYS) {
    if (!isFiniteNumber(value[key])) return null;
    vector[key] = Math.max(0, value[key]);
  }
  return vector;
}

function toAffectReading(value: unknown): AffectReading | null {
  if (!isRecord(value)) return null;
  const vector = toEmotionVector(value.vector);
  const weights = isRecord(value.weights) ? value.weights : null;
  if (!vector || !isEmotionKey(value.dominant) || !weights) return null;

  return {
    vector,
    dominant: value.dominant,
    score: clamp(value.score, vector[value.dominant]),
    energy: clamp(value.energy, EMOTION_DB[value.dominant].energy),
    pleasantness: clamp(value.pleasantness, EMOTION_DB[value.dominant].pleasantness),
    confidence: clamp(value.confidence, 0.5),
    weights: {
      objective: clamp(weights.objective, 0.55),
      subjective: clamp(weights.subjective, 0.45),
    },
  };
}

function toVegetationKinds(value: unknown, fallback: SpaceParameters["vegetationKinds"]) {
  if (!Array.isArray(value)) return fallback;
  const kinds = value.filter((item): item is SpaceParameters["vegetationKinds"][number] =>
    typeof item === "string" && (VEGETATION_KINDS as readonly string[]).includes(item)
  );
  return kinds.length > 0 ? kinds : fallback;
}

function toSpaceParameters(value: unknown): SpaceParameters | null {
  if (!isRecord(value) || !isEmotionKey(value.emotion)) return null;
  const defaults = EMOTION_DB[value.emotion];
  const weatherMode = isWeatherMode(value.weatherMode) ? value.weatherMode : "cloudy";

  return {
    emotion: value.emotion,
    emotionLabel: stringOr(value.emotionLabel, defaults.label),
    energy: clamp(value.energy, defaults.energy),
    pleasantness: clamp(value.pleasantness, defaults.pleasantness),
    score: clamp(value.score, 0.5),
    vegetationDensity: clamp(value.vegetationDensity, defaults.vegetation.density),
    vegetationKinds: toVegetationKinds(value.vegetationKinds, defaults.vegetation.kinds),
    material: stringOr(value.material, defaults.material.name),
    architectureStyle: stringOr(value.architectureStyle, defaults.architectureStyle),
    roofForm: stringOr(value.roofForm, defaults.roofForm),
    verticality: clamp(value.verticality, defaults.verticality),
    massingComplexity: clamp(value.massingComplexity, defaults.massingComplexity),
    circulationTurns: clampInt(value.circulationTurns, defaults.circulationTurns * 7 + 2, 2, 9),
    lightSource: stringOr(value.lightSource, defaults.light.source),
    lightWarmth: clamp(value.lightWarmth, defaults.light.warmth),
    lightIntensity: clamp(value.lightIntensity, defaults.light.intensity),
    weather: stringOr(value.weather, defaults.weather),
    weatherMode,
    sound: stringOr(value.sound, defaults.sound.source),
    paletteAccent: stringOr(value.paletteAccent, defaults.accent),
    behaviorCue: stringOr(value.behaviorCue, defaults.behaviorCue),
  };
}

function toPhysio(value: unknown): CheckIn["physio"] | undefined {
  if (!isRecord(value)) return undefined;
  const physio: NonNullable<CheckIn["physio"]> = {};
  if (isFiniteNumber(value.hrv)) physio.hrv = value.hrv;
  if (isFiniteNumber(value.restingHr)) physio.restingHr = value.restingHr;
  if (isFiniteNumber(value.eda)) physio.eda = value.eda;
  if (isFiniteNumber(value.motion)) physio.motion = value.motion;
  return Object.keys(physio).length > 0 ? physio : undefined;
}

function toCheckIn(value: unknown): CheckIn | null {
  if (!isRecord(value)) return null;
  const reading = toAffectReading(value.reading);
  const params = toSpaceParameters(value.params);
  if (!reading || !params || !isFiniteNumber(value.ts)) return null;

  const date =
    typeof value.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.date)
      ? value.date
      : todayKey(new Date(value.ts));
  const source = SOURCES.includes(value.source as (typeof SOURCES)[number])
    ? (value.source as CheckIn["source"])
    : "pick";
  const seed = isFiniteNumber(value.seed)
    ? value.seed
    : makeSeed(date, value.ts, params.emotion, Math.round(reading.score * 1000));
  const note = typeof value.note === "string" ? value.note : undefined;
  const physio = toPhysio(value.physio);

  return {
    id: stringOr(value.id, `${date}-${seed}`),
    ts: value.ts,
    date,
    seed,
    source,
    reading,
    params,
    ...(note ? { note } : {}),
    ...(physio ? { physio } : {}),
  };
}

function parseStoredItems(raw: string): unknown[] {
  const parsed = JSON.parse(raw) as unknown;
  if (Array.isArray(parsed)) return parsed;
  if (isRecord(parsed) && Array.isArray(parsed.items)) return parsed.items;
  return [];
}

export function loadCheckIns(): CheckIn[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return parseStoredItems(raw).map(toCheckIn).filter((item): item is CheckIn => item !== null);
  } catch {
    return [];
  }
}

export function saveCheckIn(c: CheckIn): CheckIn[] {
  const clean = toCheckIn(c) ?? c;
  const all = [...loadCheckIns(), clean];
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(all));
    } catch {
      // Quota/private-mode failures should not break the active check-in flow.
    }
  }
  return all;
}

export function clearCheckIns(): void {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}

export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** ISO week key, for example 2026-W27. */
export function weekKeyOf(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const week =
    1 +
    Math.round(
      ((target.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7
    );
  return `${target.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function volatility(scores: number[]): number {
  const safeScores = scores.map((s) => clamp(s));
  if (safeScores.length < 2) return 0;
  const mean = safeScores.reduce((a, b) => a + b, 0) / safeScores.length;
  const variance = safeScores.reduce((a, b) => a + (b - mean) ** 2, 0) / safeScores.length;
  const sd = Math.sqrt(variance);
  const range = Math.max(...safeScores) - Math.min(...safeScores);
  return Math.min(1, sd * 1.6 + range * 0.5);
}

function dominantOf(items: CheckIn[]): { dominant: EmotionKey; label: string } {
  const tally = new Map<EmotionKey, number>();
  for (const c of items) {
    tally.set(c.params.emotion, (tally.get(c.params.emotion) ?? 0) + clamp(c.reading.score));
  }
  let best: EmotionKey = items[0]?.params.emotion ?? "calm";
  let bestV = -1;
  for (const [k, v] of tally) if (v > bestV) ((bestV = v), (best = k));
  const label = items.find((c) => c.params.emotion === best)?.params.emotionLabel ?? EMOTION_DB[best].label;
  return { dominant: best, label };
}

export function groupByDay(checkIns: CheckIn[]): DaySpace[] {
  const byDate = new Map<string, CheckIn[]>();
  for (const c of checkIns.map(toCheckIn).filter((item): item is CheckIn => item !== null)) {
    if (!byDate.has(c.date)) byDate.set(c.date, []);
    byDate.get(c.date)!.push(c);
  }
  return [...byDate.entries()]
    .map(([date, items]) => {
      const sorted = [...items].sort((a, b) => a.ts - b.ts);
      const scores = sorted.map((i) => clamp(i.reading.score));
      const { dominant, label } = dominantOf(sorted);
      return {
        date,
        checkIns: sorted,
        meanScore: scores.reduce((a, b) => a + b, 0) / scores.length,
        volatility: volatility(scores),
        dominant,
        emotionLabel: label,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function groupByWeek(days: DaySpace[]): WeekPlatform[] {
  const byWeek = new Map<string, DaySpace[]>();
  for (const d of days) {
    const wk = weekKeyOf(d.date);
    if (!byWeek.has(wk)) byWeek.set(wk, []);
    byWeek.get(wk)!.push(d);
  }
  return [...byWeek.entries()]
    .map(([weekKey, ds]) => {
      const sorted = [...ds].sort((a, b) => a.date.localeCompare(b.date));
      const { dominant, label } = dominantOf(sorted.flatMap((d) => d.checkIns));
      return {
        weekKey,
        startDate: sorted[0].date,
        days: sorted,
        volatility: volatility(sorted.map((d) => d.meanScore)),
        dominant,
        emotionLabel: label,
      };
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

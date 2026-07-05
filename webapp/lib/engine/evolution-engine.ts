import {
  EMOTION_KEYS,
  type AffectReading,
  type EmotionKey,
  type EmotionVector,
  type PhysioSignals,
  type SpaceParameters,
  type SubjectiveInput,
} from "./types";
import { EMOTION_DB, WHEEL_ORDER } from "./translation-db";
import { weatherFromReading } from "./weather";

function finiteNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, finiteNumber(n, lo)));

function isEmotionKey(value: unknown): value is EmotionKey {
  return typeof value === "string" && (EMOTION_KEYS as readonly string[]).includes(value);
}

export function blankVector(): EmotionVector {
  return { confident: 0, calm: 0, joyful: 0, scared: 0, sad: 0, mad: 0 };
}

export function normalizeVector(v: EmotionVector): EmotionVector {
  const sum = EMOTION_KEYS.reduce((s, k) => s + Math.max(0, finiteNumber(v[k])), 0);
  const out = blankVector();
  if (sum <= 1e-6) {
    EMOTION_KEYS.forEach((k) => (out[k] = 1 / EMOTION_KEYS.length));
    return out;
  }
  EMOTION_KEYS.forEach((k) => (out[k] = Math.max(0, finiteNumber(v[k])) / sum));
  return out;
}

export function dominantOf(v: EmotionVector): { key: EmotionKey; score: number } {
  let key: EmotionKey = "calm";
  let score = -1;
  EMOTION_KEYS.forEach((k) => {
    const value = finiteNumber(v[k]);
    if (value > score) {
      score = value;
      key = k;
    }
  });
  return { key, score: clamp(score) };
}

function blendScalar(v: EmotionVector, pick: (e: EmotionKey) => number): number {
  return EMOTION_KEYS.reduce((s, k) => s + finiteNumber(v[k]) * finiteNumber(pick(k)), 0);
}

function sharpen(v: EmotionVector, gamma = 3): EmotionVector {
  const out = blankVector();
  let sum = 0;
  EMOTION_KEYS.forEach((k) => {
    out[k] = Math.pow(Math.max(0, finiteNumber(v[k])), gamma);
    sum += out[k];
  });
  if (sum <= 1e-6) return normalizeVector(v);
  EMOTION_KEYS.forEach((k) => (out[k] /= sum));
  return out;
}

const contrast01 = (x: number, k = 1.7) => clamp(0.5 + (x - 0.5) * k);

export function vectorFromWheel(angleDeg: number, radius: number): EmotionVector {
  const r = clamp(radius);
  const baseAngle = finiteNumber(angleDeg, 60);
  const a = ((baseAngle % 360) + 360) % 360;
  const v = blankVector();
  WHEEL_ORDER.forEach(({ key, angle }) => {
    let d = Math.abs(a - angle);
    if (d > 180) d = 360 - d;
    v[key] = Math.exp(-Math.pow(d / 38, 2));
  });
  const norm = normalizeVector(v);
  EMOTION_KEYS.forEach((k) => (norm[k] = norm[k] * r + (1 - r) / EMOTION_KEYS.length));
  return normalizeVector(norm);
}

interface PhysioDerived {
  vector: EmotionVector;
  energy: number;
  pleasantness: number;
}

export function physioToAffect(p: PhysioSignals): PhysioDerived {
  const hrvN = clamp((finiteNumber(p.hrv, 20) - 20) / (100 - 20));
  const restingHrN = p.restingHr === undefined ? 0.35 : clamp((finiteNumber(p.restingHr, 64) - 45) / (110 - 45));
  const sc = clamp(finiteNumber(p.skinConductance));
  const mo = clamp(finiteNumber(p.motion));

  const energy = clamp(0.4 * sc + 0.3 * mo + 0.18 * (1 - hrvN) + 0.12 * restingHrN);
  const pleasantness = clamp(0.55 * hrvN + 0.35 * (1 - sc) + 0.1 * (1 - restingHrN));

  const v = blankVector();
  EMOTION_KEYS.forEach((k) => {
    const e = EMOTION_DB[k];
    const d2 = Math.pow(energy - e.energy, 2) + Math.pow(pleasantness - e.pleasantness, 2);
    v[k] = Math.exp(-d2 / (2 * 0.16 * 0.16 + 1e-6));
  });
  return { vector: normalizeVector(v), energy, pleasantness };
}

export interface FuseOptions {
  baseObjectiveWeight?: number;
}

function l1(a: EmotionVector, b: EmotionVector): number {
  return EMOTION_KEYS.reduce((s, k) => s + Math.abs(finiteNumber(a[k]) - finiteNumber(b[k])), 0);
}

export function fuse(
  subjective: SubjectiveInput,
  physio: PhysioSignals,
  opts: FuseOptions = {}
): AffectReading {
  const base = clamp(opts.baseObjectiveWeight ?? 0.55, 0.3, 0.75);
  const subjVec = normalizeVector(subjective.vector);
  const obj = physioToAffect(physio);
  const objVec = obj.vector;

  const motion = clamp(finiteNumber(physio.motion));
  const wObj = clamp(base - 0.25 * motion, 0.3, 0.62);
  const wSubj = 1 - wObj;

  const fusedRaw = blankVector();
  EMOTION_KEYS.forEach((k) => (fusedRaw[k] = wObj * objVec[k] + wSubj * subjVec[k]));
  const vector = normalizeVector(fusedRaw);
  const { key: dominant, score } = dominantOf(vector);

  const agreement = 1 - l1(objVec, subjVec) / 2;
  const confidence = clamp(agreement * (1 - 0.3 * motion));

  const anchorEnergy = blendScalar(vector, (k) => EMOTION_DB[k].energy);
  const anchorPleasant = blendScalar(vector, (k) => EMOTION_DB[k].pleasantness);
  const energy = clamp(0.6 * anchorEnergy + 0.4 * obj.energy);
  const pleasantness = clamp(0.6 * anchorPleasant + 0.4 * obj.pleasantness);

  return {
    vector,
    dominant,
    score,
    energy,
    pleasantness,
    confidence,
    weights: { objective: wObj, subjective: wSubj },
  };
}

export function toSpaceParameters(reading: AffectReading): SpaceParameters {
  const vector = normalizeVector(reading.vector);
  const dominant = isEmotionKey(reading.dominant) ? reading.dominant : dominantOf(vector).key;
  const dom = EMOTION_DB[dominant];
  const vs = sharpen(vector, 3);

  const energy = clamp(reading.energy, 0, 1);
  const pleasantness = clamp(reading.pleasantness, 0, 1);
  const score = clamp(reading.score, 0, 1);
  const vegetationDensity = clamp(contrast01(blendScalar(vs, (k) => EMOTION_DB[k].vegetation.density), 1.6));
  const verticality = clamp(contrast01(blendScalar(vs, (k) => EMOTION_DB[k].verticality), 2.0));
  const massingComplexity = clamp(contrast01(blendScalar(vs, (k) => EMOTION_DB[k].massingComplexity), 2.1));
  const turnsScalar = clamp(blendScalar(vs, (k) => EMOTION_DB[k].circulationTurns));
  const lightWarmth = clamp(blendScalar(vs, (k) => EMOTION_DB[k].light.warmth));
  const lightIntensity = clamp(contrast01(blendScalar(vs, (k) => EMOTION_DB[k].light.intensity), 1.4));
  const weatherMode = weatherFromReading(energy, pleasantness);

  return {
    emotion: dominant,
    emotionLabel: dom.label,
    energy,
    pleasantness,
    score,
    vegetationDensity,
    vegetationKinds: [...dom.vegetation.kinds],
    material: dom.material.name,
    architectureStyle: dom.architectureStyle,
    roofForm: dom.roofForm,
    verticality,
    massingComplexity,
    circulationTurns: Math.round(2 + 7 * turnsScalar),
    lightSource: dom.light.source,
    lightWarmth,
    lightIntensity,
    weather: dom.weather,
    weatherMode,
    sound: dom.sound.source,
    paletteAccent: dom.accent,
    behaviorCue: dom.behaviorCue,
  };
}

export function evolve(subjective: SubjectiveInput, physio: PhysioSignals, opts?: FuseOptions) {
  const reading = fuse(subjective, physio, opts);
  const params = toSpaceParameters(reading);
  return { reading, params };
}

import { EMOTION_DB } from "./translation-db";
import { EMOTION_KEYS, type EmotionKey, type EmotionVector } from "./types";

export interface EmotionMixItem {
  key: EmotionKey;
  label: string;
  pct: number;
  energy: number;
  pleasantness: number;
}

const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));

function normalisePercentages(items: Omit<EmotionMixItem, "pct">[], weights: number[]): EmotionMixItem[] {
  const sum = weights.reduce((s, w) => s + w, 0) || 1;
  const raw = weights.map((w) => (w / sum) * 100);
  const floored = raw.map(Math.floor);
  let remaining = 100 - floored.reduce((s, n) => s + n, 0);
  const order = raw
    .map((value, index) => ({ index, rest: value - floored[index] }))
    .sort((a, b) => b.rest - a.rest);

  for (let i = 0; i < order.length && remaining > 0; i += 1, remaining -= 1) {
    floored[order[i].index] += 1;
  }

  return items.map((item, index) => ({ ...item, pct: floored[index] }));
}

export function affectFromVector(vector: EmotionVector): { energy: number; pleasantness: number } {
  let total = 0;
  let energy = 0;
  let pleasantness = 0;

  EMOTION_KEYS.forEach((key) => {
    const weight = Math.max(0, vector[key]);
    total += weight;
    energy += weight * EMOTION_DB[key].energy;
    pleasantness += weight * EMOTION_DB[key].pleasantness;
  });

  if (total <= 0) return { energy: EMOTION_DB.calm.energy, pleasantness: EMOTION_DB.calm.pleasantness };
  return { energy: clamp(energy / total), pleasantness: clamp(pleasantness / total) };
}

export function mixFromAffect(energy: number, pleasantness: number): EmotionMixItem[] {
  const items = EMOTION_KEYS.map((key) => ({
    key,
    label: EMOTION_DB[key].label,
    energy: EMOTION_DB[key].energy,
    pleasantness: EMOTION_DB[key].pleasantness,
  }));

  const weights = items.map((item) => {
    const d2 = Math.pow(energy - item.energy, 2) + Math.pow(pleasantness - item.pleasantness, 2);
    return Math.exp(-d2 / (2 * 0.18 * 0.18));
  });

  return normalisePercentages(items, weights).sort((a, b) => b.pct - a.pct);
}

export function mixFromVector(vector: EmotionVector): EmotionMixItem[] {
  const { energy, pleasantness } = affectFromVector(vector);
  const anchorMix = mixFromAffect(energy, pleasantness);
  const vectorTotal = EMOTION_KEYS.reduce((s, key) => s + Math.max(0, vector[key]), 0) || 1;
  const weights = anchorMix.map((item) => {
    const vectorWeight = Math.max(0, vector[item.key]) / vectorTotal;
    return item.pct / 100 * 0.45 + vectorWeight * 0.55;
  });

  return normalisePercentages(
    anchorMix.map(({ key, label, energy: e, pleasantness: p }) => ({ key, label, energy: e, pleasantness: p })),
    weights
  ).sort((a, b) => b.pct - a.pct);
}

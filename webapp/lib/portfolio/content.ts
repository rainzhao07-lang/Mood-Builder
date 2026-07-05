import type { DailyPlatform, EmotionKey, PhysioSignals } from "@/lib/engine/types";
import { EMOTION_KEYS } from "@/lib/engine/types";
import { composeSpace, makeSeed } from "@/lib/engine/composer";
import { evolve, vectorFromWheel } from "@/lib/engine/evolution-engine";
import { EMOTION_DB, SAMPLE_MIX } from "@/lib/engine/translation-db";

export interface ResearchThread {
  title: string;
  claim: string;
  designMove: string;
}

export interface ScreenSpec {
  id: number;
  name: string;
  purpose: string;
  coreContent: string;
  figmaNote: string;
}

export const RESEARCH_THREADS: ResearchThread[] = [
  {
    title: "Self-report is ambiguous",
    claim:
      "A single mood label rarely carries enough resolution. The interface needs a quiet way to capture direction, intensity and uncertainty.",
    designMove:
      "Use the emotion wheel as a spatial input, then keep confidence visible instead of pretending the reading is absolute.",
  },
  {
    title: "Physiology needs interpretation",
    claim:
      "HRV, conductance and motion are useful only after calibration. They should influence a reading, not replace the person describing their own state.",
    designMove:
      "Blend subjective and objective streams with visible weights, then let disagreement lower confidence.",
  },
  {
    title: "Memory should be spatial",
    claim:
      "Mood tracking becomes more legible when days can be compared as places rather than only as charts.",
    designMove:
      "Save every reading as a daily platform; stack platforms into an observation deck with traces and annotations.",
  },
  {
    title: "Generated form must stay explainable",
    claim:
      "A generative system needs rules the viewer can inspect. Otherwise the spatial output feels decorative rather than authored.",
    designMove:
      "Expose the translation database: emotion families map to materials, vegetation, roof form, light, sound and weather.",
  },
];

export const PHONE_SCREEN_FLOW: ScreenSpec[] = [
  { id: 1, name: "Observe", purpose: "Entry and proposition", coreContent: "Wordmark, short premise, Observe button", figmaNote: "Keep hero on 340 x 710; Fraunces 30/34, regular/medium, -1% tracking." },
  { id: 2, name: "Home / Phase", purpose: "Current emotional and spatial state", coreContent: "Emotion State, Energy/Pleasantness field, Stage 2/5 progress", figmaNote: "Metric values use Fraunces; secondary copy uses Newsreader italic." },
  { id: 3, name: "Subjective Input", purpose: "Capture the user's self-report", coreContent: "Emotion wheel, capture state, calibration note", figmaNote: "Six spokes, uppercase 9px labels, central dot; no filled dark panel." },
  { id: 4, name: "Physiological Signals", purpose: "Show objective calibration stream", coreContent: "HRV, skin conductance, motion rows", figmaNote: "Signal rows should be quiet cards, not table-heavy rows." },
  { id: 5, name: "Generate Space", purpose: "Confirm first spatial composition", coreContent: "Generated space, cause sentence, activate interaction", figmaNote: "Render area should breathe; caption italic under the image." },
  { id: 6, name: "Adjust Space", purpose: "Let the user tune controllable parameters", coreContent: "Density, tone, lighting, layout sliders", figmaNote: "Slider thumbs are 16px dark slate with pale ring." },
  { id: 7, name: "Temporal Layer", purpose: "Connect today's result to time", coreContent: "Snapshot, time gate, day chips", figmaNote: "Use gold only on progress/stage marks." },
  { id: 8, name: "Insights", purpose: "Explain deltas and drivers", coreContent: "Key changes, objective/subjective drivers, archive chips", figmaNote: "Driver percentages should be mono, not large hero numbers." },
  { id: 9, name: "Archive", purpose: "Browse saved daily platforms", coreContent: "Filters, Day 14/11 cards, compare selected", figmaNote: "Cards need 16px radius and restrained shadows." },
  { id: 10, name: "Compare", purpose: "Compare two snapshots", coreContent: "Before/after slider, deltas, focus chips", figmaNote: "Keep before/after labels small and uppercased." },
  { id: 11, name: "Immersive Entry", purpose: "Bridge mobile state into first-person view", coreContent: "Interior preview, enter button, safety caption", figmaNote: "Dark screen is allowed here, but typography stays quiet." },
  { id: 12, name: "Immersive View", purpose: "First-person spatial inspection", coreContent: "Viewport, interaction affordances, return control", figmaNote: "Controls should float as minimal pills, not heavy panels." },
  { id: 13, name: "Observation Deck", purpose: "See days as stacked platforms", coreContent: "Platform stack, altitude slider, affective trace", figmaNote: "This is the portfolio hero screen; reserve extra polish here." },
  { id: 14, name: "Translation Reference", purpose: "Make the system logic inspectable", coreContent: "Emotion family to material/light/plant mapping", figmaNote: "Use compact database rows; avoid oversized explanatory text." },
];

export const FRAMEWORK_STEPS = [
  "Subjective Input",
  "Objective Input",
  "Emotion State Engine",
  "Spatial State Engine",
  "Temporal Layer",
  "Observation Deck",
];

const SAMPLE_INPUTS: Array<{
  day: number;
  date: string;
  capturedAt: string;
  stage: number;
  angle: number;
  radius: number;
  physio: PhysioSignals;
}> = [
  { day: 1, date: "2026-03-01", capturedAt: "08:42", stage: 1, angle: 210, radius: 0.54, physio: { hrv: 46, skinConductance: 0.58, motion: 0.22 } },
  { day: 2, date: "2026-03-02", capturedAt: "21:18", stage: 1, angle: 185, radius: 0.62, physio: { hrv: 40, skinConductance: 0.5, motion: 0.12 } },
  { day: 3, date: "2026-03-03", capturedAt: "09:10", stage: 1, angle: 300, radius: 0.66, physio: { hrv: 61, skinConductance: 0.35, motion: 0.48 } },
  { day: 4, date: "2026-03-04", capturedAt: "19:34", stage: 1, angle: 64, radius: 0.58, physio: { hrv: 70, skinConductance: 0.31, motion: 0.16 } },
  { day: 5, date: "2026-03-05", capturedAt: "08:57", stage: 1, angle: 118, radius: 0.7, physio: { hrv: 36, skinConductance: 0.68, motion: 0.26 } },
  { day: 6, date: "2026-03-06", capturedAt: "22:02", stage: 1, angle: 248, radius: 0.5, physio: { hrv: 48, skinConductance: 0.55, motion: 0.42 } },
  { day: 7, date: "2026-03-07", capturedAt: "10:22", stage: 2, angle: 58, radius: 0.72, physio: { hrv: 74, skinConductance: 0.25, motion: 0.11 } },
  { day: 8, date: "2026-03-08", capturedAt: "09:46", stage: 2, angle: 36, radius: 0.6, physio: { hrv: 68, skinConductance: 0.29, motion: 0.18 } },
  { day: 9, date: "2026-03-09", capturedAt: "20:11", stage: 2, angle: 305, radius: 0.75, physio: { hrv: 64, skinConductance: 0.38, motion: 0.52 } },
  { day: 10, date: "2026-03-10", capturedAt: "07:54", stage: 2, angle: 122, radius: 0.63, physio: { hrv: 39, skinConductance: 0.7, motion: 0.2 } },
  { day: 11, date: "2026-03-11", capturedAt: "22:10", stage: 2, angle: 128, radius: 0.74, physio: { hrv: 34, skinConductance: 0.72, motion: 0.18 } },
  { day: 12, date: "2026-03-12", capturedAt: "09:02", stage: 2, angle: 76, radius: 0.62, physio: { hrv: 66, skinConductance: 0.34, motion: 0.14 } },
  { day: 13, date: "2026-03-13", capturedAt: "08:38", stage: 2, angle: 42, radius: 0.7, physio: { hrv: 76, skinConductance: 0.27, motion: 0.18 } },
  { day: 14, date: "2026-03-14", capturedAt: "09:41", stage: 2, angle: 60, radius: 0.72, physio: { hrv: 72, skinConductance: 0.28, motion: 0.12 } },
];

function keywordsFor(emotion: EmotionKey): string[] {
  const db = EMOTION_DB[emotion];
  return [db.material.name, db.roofForm, db.weather.split(" ")[0]];
}

function makePlatform(input: (typeof SAMPLE_INPUTS)[number]): DailyPlatform {
  const subjective = { vector: vectorFromWheel(input.angle, input.radius) };
  const { reading, params } = evolve(subjective, input.physio);
  const seed = makeSeed(input.date, input.day, params.emotion, Math.round(reading.score * 100));
  const space = composeSpace(params, seed);
  const volatility = Math.min(1, params.massingComplexity * 0.65 + params.circulationTurns / 18);

  return {
    id: `day-${input.day}`,
    date: input.date,
    day: input.day,
    stage: input.stage,
    reading,
    params,
    seed: space.seed,
    capturedAt: input.capturedAt,
    metrics: {
      mean: Math.round((reading.energy * 0.45 + reading.pleasantness * 0.55) * 100),
      peak: Math.round(Math.max(reading.energy, reading.pleasantness, reading.score) * 100),
      volatility,
      confidence: reading.confidence,
      snapshots: Math.round(2 + reading.confidence * 5),
      keywords: keywordsFor(params.emotion),
    },
  };
}

export const DAILY_PLATFORMS: DailyPlatform[] = SAMPLE_INPUTS.map(makePlatform);
export const LATEST_PLATFORM = DAILY_PLATFORMS[DAILY_PLATFORMS.length - 1];

export const LOGIC_MIX = SAMPLE_MIX.map((entry) => ({
  ...entry,
  label: EMOTION_DB[entry.key].label,
  style: EMOTION_DB[entry.key].architectureStyle,
}));

export const EMOTION_SUMMARY = EMOTION_KEYS.map((key) => {
  const db = EMOTION_DB[key];
  return {
    key,
    label: db.label,
    style: db.architectureStyle,
    material: db.material.name,
    vegetation: db.vegetation.note,
    roof: db.roofForm,
    light: db.light.source,
    sound: db.sound.source,
    weather: db.weather,
    accent: db.accent,
  };
});

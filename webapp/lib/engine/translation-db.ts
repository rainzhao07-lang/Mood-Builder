/* ============================================================
   Mood Builder — Translation Database(翻译数据库)
   把"抽象情绪"映射成"精确的建筑词汇":风格 / 材料 / 植被 /
   屋顶 / 流线 / 光 / 声 / 天气。数据照搬自作品集第 4 板
   (Translation Database)与第 5 板(Logic Diagram)。
   这是项目真正的 IP —— 引擎与可视化板都以它为唯一信源。
   ============================================================ */

import type { EmotionKey, VegetationInstance } from "./types";

export interface EmotionArchitecture {
  key: EmotionKey;
  label: string;
  /** 情绪轮该家族下的若干叶子词(用于轮盘与词云) */
  leaves: string[];
  architectureStyle: string;
  styleLogic: string;
  material: { name: string; build: string; perception: string; spatialEffect: string };
  vegetation: { density: number; kinds: VegetationInstance["kind"][]; note: string };
  roofForm: string;
  circulation: string;
  light: { source: string; warmth: number; intensity: number; behaviour: string };
  sound: { source: string; mapping: string };
  weather: string;
  /** 垂直性 0..1(追高/压低) */
  verticality: number;
  /** 体量起伏 / 非正交度 0..1 */
  massingComplexity: number;
  /** 流线转折强度 0..1(迂回/压抑) */
  circulationTurns: number;
  /** 行为线索(Observation Deck 风格) */
  behaviorCue: string;
  /** 该情绪在情绪坐标上的锚点 */
  energy: number; // 0..1 唤醒
  pleasantness: number; // 0..1 愉悦
  /** 氛围强调色(走 token 体系) */
  accent: string;
}

export const EMOTION_DB: Record<EmotionKey, EmotionArchitecture> = {
  confident: {
    key: "confident",
    label: "Confident",
    leaves: ["Inspired", "Proud", "Worthy", "Motivated", "Appreciated", "Respected", "Faithful", "Valuable"],
    architectureStyle: "Classical Greek / Roman",
    styleLogic:
      "Column orders, proportion, symmetry, axial composition. A processional axis and clear hierarchy give a monumental, civic presence — strength read as order.",
    material: {
      name: "Marble",
      build: "Calcite stone, cut and high-polished; acid/stain sensitive.",
      perception: "Refined, delicate luxury — cool, ceremonial.",
      spatialEffect: "A disciplined display-skin: value and distance set against raw nature.",
    },
    vegetation: {
      density: 0.7,
      kinds: ["pine", "shrub"],
      note: "Tall pines & cypresses for strength and stability; small plants for vibrancy. Symmetry and layering.",
    },
    roofForm: "Pediment & colonnade",
    circulation: "Axial, processional — clear hierarchy, few choices",
    light: {
      source: "Daylight / Spotlight",
      warmth: 0.5,
      intensity: 0.82,
      behaviour: "Sharp highlights and shadows; strong focal control.",
    },
    sound: { source: "Instrumental", mapping: "Structured pitch and rhythm; clear attacks — patterns you can follow." },
    weather: "Sunny — outward, exposed, socially open.",
    verticality: 0.86,
    massingComplexity: 0.08,
    circulationTurns: 0.2,
    behaviorCue: "You make small corrections often — like you are tuning the environment to match your pace.",
    energy: 0.62,
    pleasantness: 0.72,
    accent: "#7f9b72",
  },

  calm: {
    key: "calm",
    label: "Calm",
    leaves: ["Content", "Peaceful", "Serene", "Relaxed", "Trusting", "Secure", "Comfortable", "Caring"],
    architectureStyle: "Byzantine",
    styleLogic:
      "Centralised domed space and layered enclosures. Peace reads as inner harmony; symmetrical, curved roof forms make a relaxing, fulfilling space.",
    material: {
      name: "Wood",
      build: "Sawed and joined / laminated; workable; needs moisture protection.",
      perception: "Warm, breathable, familiar — craft and everyday.",
      spatialEffect: "A touchable buffer that softens the detachment of metal and stone.",
    },
    vegetation: {
      density: 0.55,
      kinds: ["shrub", "blossom"],
      note: "Soft hydrangea and low planting; rounded and sheltering.",
    },
    roofForm: "Low dome / curved vault",
    circulation: "Gentle loop — few turns, settling",
    light: {
      source: "Lantern / Moonlight",
      warmth: 0.7,
      intensity: 0.4,
      behaviour: "Soft, diffused glow; reduced glare; a defined glow-zone.",
    },
    sound: { source: "Natural", mapping: "Wind, rain, birds, water — quiet company that supports attention." },
    weather: "Cloudy — buffered, inward.",
    verticality: 0.32,
    massingComplexity: 0.05,
    circulationTurns: 0.25,
    behaviorCue: "You linger and let moments complete — less checking, more trusting the flow.",
    energy: 0.3,
    pleasantness: 0.8,
    accent: "#5f9ea0",
  },

  joyful: {
    key: "joyful",
    label: "Joyful",
    leaves: ["Happy", "Delighted", "Optimistic", "Excited", "Energetic", "Creative", "Cheerful", "Hopeful"],
    architectureStyle: "Art Deco",
    styleLogic:
      "Geometric ornament, symmetry, stepped setbacks. Sunburst and chevron motifs with metal accents read as warm, vibrant and outward.",
    material: {
      name: "Polished marble & warm stone",
      build: "Smooth marble and natural stone; high-polished, lustrous.",
      perception: "Warm, comfortable, vital.",
      spatialEffect: "Luster and delicate texture lift the space — relaxed, positive, abundant.",
    },
    vegetation: {
      density: 0.8,
      kinds: ["blossom", "canna"],
      note: "Flowering canna and silk-tree (Albizia); bright, outward, abundant.",
    },
    roofForm: "Stepped setback / sunburst crown",
    circulation: "Open radial — many routes, exploratory",
    light: {
      source: "Bonfire / Sunlight",
      warmth: 0.85,
      intensity: 0.9,
      behaviour: "Bright, warm, fluctuating light; wide spill.",
    },
    sound: { source: "Instrumental (percussion)", mapping: "Percussion releases energy — light and lifting." },
    weather: "Sunny — energised, socially open.",
    verticality: 0.6,
    massingComplexity: 0.35,
    circulationTurns: 0.3,
    behaviorCue: "You move in bursts, look around quickly and touch more points — testing what responds.",
    energy: 0.85,
    pleasantness: 0.82,
    accent: "#d9a441",
  },

  scared: {
    key: "scared",
    label: "Scared",
    leaves: ["Worried", "Baffled", "Confused", "Helpless", "Insecure", "Nervous", "Anxious", "Overwhelmed"],
    architectureStyle: "Gothic",
    styleLogic:
      "Pointed arch, rib vault and flying buttress; verticality, spires and tracery. Towering structures and intricate decoration create oppression and unease.",
    material: {
      name: "Steel / Iron",
      build: "Cut, bent, welded frame; coated or brushed surface.",
      perception: "Precise, cold, commanding — keeps the body at distance.",
      spatialEffect: "Structural order and readable thresholds; boundaries become lines.",
    },
    vegetation: {
      density: 0.08,
      kinds: ["pine"],
      note: "Sparse, shadowed planting; growth reads as fragile against hard ground.",
    },
    roofForm: "Spires & pinnacles",
    circulation: "Narrow, high-contrast — scanning for a path that feels less exposed",
    light: {
      source: "Flashlight / Moonlight",
      warmth: 0.25,
      intensity: 0.35,
      behaviour: "Directional beam; selective reveal; strong cloud-affected shadows.",
    },
    sound: { source: "Traffic noise", mapping: "Continuous low-mid floor with sharp peaks; high masking, guarded." },
    weather: "Storm — threat, loss of control.",
    verticality: 0.95,
    massingComplexity: 0.6,
    circulationTurns: 0.85,
    behaviorCue: "You choose sheltered routes and pause at edges — seeking soft boundaries.",
    energy: 0.7,
    pleasantness: 0.25,
    accent: "#536878",
  },

  sad: {
    key: "sad",
    label: "Sad",
    leaves: ["Depressed", "Lonely", "Bored", "Empty", "Isolated", "Despair", "Guilty", "Abandoned"],
    architectureStyle: "Heavy mass / confinement",
    styleLogic:
      "Twists, turns and straight confinement in the circulation express repression. Stagnation and despondency make the space feel isolated and powerless.",
    material: {
      name: "Concrete",
      build: "Cast cement + aggregate; high compressive strength; rough, polished or raw finish.",
      perception: "Cold, heavy, mute — an urban base layer.",
      spatialEffect: "A hard ground/boundary that makes natural growth read as fragile.",
    },
    vegetation: {
      density: 0.14,
      kinds: ["shrub"],
      note: "Low, muted ground cover; little canopy.",
    },
    roofForm: "Flat heavy slab",
    circulation: "Confined switchbacks — repression, dead-ends",
    light: {
      source: "Kerosene lamp",
      warmth: 0.5,
      intensity: 0.25,
      behaviour: "Low, variable brightness; soot and shadow; short range.",
    },
    sound: { source: "Natural (rain)", mapping: "Steady rain reads as quiet company when lonely." },
    weather: "Rain — gloom, emotional noise, time slowed.",
    verticality: 0.06,
    massingComplexity: 0.28,
    circulationTurns: 0.7,
    behaviorCue: "You interact less and keep motion steady — preferring simple continuity over choices.",
    energy: 0.28,
    pleasantness: 0.22,
    accent: "#6b7280",
  },

  mad: {
    key: "mad",
    label: "Mad",
    leaves: ["Angry", "Hurt", "Hateful", "Critical", "Frustrated", "Jealous", "Annoyed", "Defensive"],
    architectureStyle: "Deconstructivism",
    styleLogic:
      "Fragmentation, displacement, folding and controlled distortion. Non-orthogonal collisions and unstable alignments turn tension into the experience itself.",
    material: {
      name: "Steel & shattered glass",
      build: "Welded steel frame with tempered/laminated glass; transparent yet brittle.",
      perception: "Hard, exposed, charged — an invisible boundary that intensifies distance.",
      spatialEffect: "Fluctuating heights and dense detailing amplify instability and intensity.",
    },
    vegetation: {
      density: 0.4,
      kinds: ["pine"],
      note: "Wind-bent, scattered planting; restless.",
    },
    roofForm: "Folded, colliding planes",
    circulation: "Event-like, broken — start / stop, disorienting",
    light: {
      source: "LED / Spotlight",
      warmth: 0.35,
      intensity: 0.7,
      behaviour: "High-efficiency, stable but hard light; sharp focal control.",
    },
    sound: { source: "Traffic + percussion", mapping: "Irregular peaks and urgency; irritation, alert state." },
    weather: "Storm — release / catharsis.",
    verticality: 0.78,
    massingComplexity: 1,
    circulationTurns: 0.6,
    behaviorCue: "You start, stop and reroute — scanning for a path that feels less exposed.",
    energy: 0.9,
    pleasantness: 0.3,
    accent: "#d95c4a",
  },
};

/** 情绪轮的顺序与角度(度),0° 指向上方,顺时针。供轮盘与 3D 用。 */
export const WHEEL_ORDER: { key: EmotionKey; angle: number }[] = [
  { key: "confident", angle: 0 },
  { key: "calm", angle: 60 },
  { key: "scared", angle: 120 },
  { key: "sad", angle: 180 },
  { key: "mad", angle: 240 },
  { key: "joyful", angle: 300 },
];

/* ============================================================
   作品集第 4 板的辅助词库 —— 供 Translation Database 页面展示。
   ============================================================ */

export const MATERIALS = [
  { name: "Concrete", build: "Cast cement + aggregate; high compressive strength; rough or polished.", perception: "Cold, heavy, mute — an urban base layer.", effect: "A hard ground/boundary that makes natural growth read as fragile." },
  { name: "Marble", build: "Calcite stone, cut and high-polished; acid/stain sensitive.", perception: "Refined, delicate luxury — cool, ceremonial.", effect: "A disciplined display-skin: value and distance against raw nature." },
  { name: "Wood", build: "Sawed and joined / laminated; workable; needs moisture protection.", perception: "Warm, breathable, familiar — craft and everyday.", effect: "A touchable buffer that softens the detachment of metal and stone." },
  { name: "Glass", build: "Tempered / laminated panels; polished edges; transparent yet brittle.", perception: "Clean, untouchable — visible but unreachable.", effect: "An invisible boundary that intensifies social distance." },
  { name: "Granite", build: "Cut natural stone; flamed or polished; very hard, weather-resistant.", perception: "Hard, stable, slow — geological, monumental time.", effect: "Terrain evidence and weight, mediating nature and the modern." },
  { name: "Steel / Iron", build: "Cut / bent / welded frame; coated or brushed surface.", perception: "Precise, cold, commanding — keeps the body at distance.", effect: "Structural order and readable thresholds; boundaries become lines." },
];

export const LIGHT_SOURCES = [
  { name: "Moonlight", source: "Reflected sunlight.", output: "Very low illuminance; cool; low contrast.", behaviour: "Strongly affected by cloud cover; soft shadows." },
  { name: "Bonfire", source: "Open combustion.", output: "Bright, warm, fluctuating; wide spill.", behaviour: "High heat; smoke / sparks; unstable shadow movement." },
  { name: "LED", source: "Solid-state diode.", output: "High efficiency; stable brightness; wide colour-temperature.", behaviour: "Low heat; minimal flicker with good drivers." },
  { name: "Lantern", source: "Enclosed light with shade / diffuser.", output: "Soft, diffused glow; reduced glare.", behaviour: "More even distribution; portable; a defined glow-zone." },
  { name: "Candle", source: "Wax fuel flame.", output: "Very low brightness; warm spectrum; visible flicker.", behaviour: "Sensitive to drafts; soot / heat; short-range." },
  { name: "Spotlight", source: "Focused luminaire.", output: "Narrow beam; high illuminance on target.", behaviour: "Sharp highlights and shadows; strong focal control." },
  { name: "Kerosene Lamp", source: "Kerosene fuel + wick (combustion).", output: "Warm spectrum; low-moderate, variable with airflow / fuel.", behaviour: "Produces heat, soot and fumes; needs ventilation." },
  { name: "Flashlight", source: "Handheld battery light.", output: "Directional beam; selectable intensity / beam shape.", behaviour: "Movable, selective reveal; limited range and runtime." },
];

export const PLANTS = [
  { name: "Canna Lily", genus: "Canna", height: "0.8–2 m", areas: "Tropical, subtropical zone" },
  { name: "Silk Tree", genus: "Albizia", height: "5–15 m", areas: "Subtropical, warm temperate zone" },
  { name: "Iris / Lily upright herb", genus: "Herbaceous perennial", height: "0.4–1.2 m", areas: "Wetland, grass slope" },
  { name: "Hydrangea", genus: "Hydrangea", height: "0.8–2 m", areas: "Temperate humid regions" },
  { name: "Pine Tree", genus: "Pinus", height: "15–45 m", areas: "Taiga, Mediterranean basin, dry tropical forests" },
];

export const ATMOSPHERE = {
  sky: {
    title: "Sky Light Regime",
    variables: "Light intensity, shadow definition, atmospheric contrast.",
    tone: "Sunny reads as outward / exposed; Cloudy reads as buffered / inward.",
    resonance: "Energised, socially-open states align with Sunny; sensitive, low or easily-overstimulated states align with Cloudy.",
  },
  water: {
    title: "Falling Water Layer",
    kinetics: "Rain = fast impact and streaks; Snow = slow drift and accumulation.",
    feedback: "Rain sharpens reflections and sound; Snow reduces contrast and dampens noise inward.",
    interpretation: "Rain reads as movement / intensity / restlessness; Snow reads as stillness / quiet / time frozen.",
  },
  storm: {
    title: "Storm Event",
    signature: "Lightning as instant visual peak; thunder as delayed acoustic mass.",
    somatic: "Startle response, heightened attention, a sense of power outside the body.",
    interpretation: "Storm reads as release / awe / catharsis — or threat, anxiety, loss of control.",
  },
};

export const SOUNDSCAPE = [
  { name: "Natural Sound", category: "Wind · Rain · Birds · Water", profile: "Organic, non-repeating layers; soft-to-moderate; wide spectrum.", mapping: "When overwhelmed, steady wind and water release pressure; when reflective, they support attention without demanding it." },
  { name: "Traffic Noise", category: "Engine · Tyre · Horns · Braking", profile: "Continuous low-mid floor with sharp peaks; high masking; hard to escape.", mapping: "When stressed, traffic adds irritation and urgency; horns / braking trigger a guarded, alert state." },
  { name: "Instrumental Sound", category: "Strings · Percussion · Winds", profile: "Structured pitch and rhythm; clear attacks; intentional dynamics.", mapping: "When low, slow strings feel supportive; when restless, percussion releases energy; seeking calm, winds feel light and lifting." },
];

/** Logic Diagram 板上那组示例配比(作品集第 5 板的取值) */
export const SAMPLE_MIX: { key: EmotionKey; pct: number }[] = [
  { key: "confident", pct: 25 },
  { key: "calm", pct: 20 },
  { key: "joyful", pct: 20 },
  { key: "sad", pct: 15 },
  { key: "scared", pct: 10 },
  { key: "mad", pct: 10 },
];

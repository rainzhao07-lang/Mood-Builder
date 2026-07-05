/* ============================================================
   Mood Builder — 引擎层类型定义
   作品集模型:Subjective Input + Objective Input
   → Emotion State Engine(normalize → weight & fuse → map → calibrate)
   → Spatial State Engine(parameters → domain rules → variants → compose)
   → Temporal Layer(snapshot → building → compare → archive → insights)
   ============================================================ */

/** 情绪轮的六大家族(对应 EmotionWheel 的六根轴) */
export type EmotionKey =
  | "confident"
  | "calm"
  | "joyful"
  | "scared"
  | "sad"
  | "mad";

export const EMOTION_KEYS: EmotionKey[] = [
  "confident",
  "calm",
  "joyful",
  "scared",
  "sad",
  "mad",
];

/** 六维情绪向量,各分量 0..1,通常归一化到和为 1 */
export type EmotionVector = Record<EmotionKey, number>;

/** 客观流:可穿戴设备采到的生理信号 */
export interface PhysioSignals {
  /** 心率变异性 (ms)。高 ≈ 副交感主导/放松,低 ≈ 应激 */
  hrv: number;
  /** Resting heart rate in bpm. */
  restingHr?: number;
  /** 皮肤电导 0..1。高 ≈ 唤醒/紧张 */
  skinConductance: number;
  /** 体动强度 0..1。高 ≈ 躁动/活跃 */
  motion: number;
}

export type WeatherMode = "clear" | "cloudy" | "rain" | "storm" | "snow";

/** 主观流:情绪轮落点转成的六维权重 */
export interface SubjectiveInput {
  vector: EmotionVector;
}

/** 情绪状态引擎的输出:一次"情绪读数" */
export interface AffectReading {
  /** 融合并归一后的六维向量 */
  vector: EmotionVector;
  /** 主导情绪 */
  dominant: EmotionKey;
  /** 主导情绪强度 0..1 */
  score: number;
  /** 唤醒度 / Energy 0..1(纵轴) */
  energy: number;
  /** 愉悦度 / Pleasantness 0..1(横轴) */
  pleasantness: number;
  /** 估计置信度 0..1:双流一致性越高越可信 */
  confidence: number;
  /** 客观 / 主观 的实际权重(会随信号质量动态调整) */
  weights: { objective: number; subjective: number };
}

/* ---------------- 空间状态引擎 ---------------- */

/** 一块体量(等距场景里的基本构件) */
export interface MassingBlock {
  /** 网格坐标(以场地中心为原点) */
  x: number;
  z: number;
  /** 平面尺寸 */
  w: number;
  d: number;
  /** 高度 */
  h: number;
  /** 类型决定渲染外观 */
  kind: "mass" | "slab" | "spire" | "ruin" | "arch";
  /** 0..1 明度扰动,制造层次 */
  tone: number;
  /** 绕 Y 轴的轻微旋转(弧度),mad/scared 会更大 */
  rot: number;
  /** 该体量的主材(从情绪材质调色板里挑,楼与楼可不同) */
  material?: string;
}

/** 一株植被实例 */
export interface VegetationInstance {
  x: number;
  z: number;
  scale: number;
  kind: "pine" | "blossom" | "shrub" | "canna";
}

/** 由情绪读数 + 翻译规则得到的"空间参数"(可渲染、可对比) */
export interface SpaceParameters {
  emotion: EmotionKey;
  emotionLabel: string;
  energy: number;
  pleasantness: number;
  score: number;
  /** 植被密度 0..1 */
  vegetationDensity: number;
  vegetationKinds: VegetationInstance["kind"][];
  /** 主材 */
  material: string;
  architectureStyle: string;
  roofForm: string;
  /** 垂直性 0..1(confident/scared 高,sad 低) */
  verticality: number;
  /** 体量起伏 / 非正交度 0..1(mad 最高) */
  massingComplexity: number;
  /** 流线转折次数(sad/scared 高 = 压抑迂回) */
  circulationTurns: number;
  lightSource: string;
  /** 光暖度 0..1 */
  lightWarmth: number;
  /** 光强 0..1 */
  lightIntensity: number;
  weather: string;
  weatherMode: WeatherMode;
  sound: string;
  /** 强调色(走 token,只用于氛围,不滥用) */
  paletteAccent: string;
  behaviorCue: string;
}

/** 空间原型:决定整体空间逻辑(建筑 or 广场 or 峡谷…),像情绪一样各不相同 */
export type SpaceArchetype = "plaza" | "court" | "towers" | "enclosure" | "field";

/** 已生成、可渲染的一份完整"空间"(参数 + 几何) */
export interface ComposedSpace {
  params: SpaceParameters;
  /** 空间原型(按主导情绪) */
  archetype: SpaceArchetype;
  /** 本空间使用的材质调色板(混搭,不是单一材质) */
  materials: string[];
  blocks: MassingBlock[];
  vegetation: VegetationInstance[];
  /** 流线折线(等距地面上的路径) */
  path: { x: number; z: number }[];
  /** 决定性种子,保证同一天/同一情绪复现同一空间 */
  seed: number;
}

/* ---------------- 时间层 ---------------- */

/** 每日平台快照:Temporal Layer 的最小单元 */
export interface DailyPlatform {
  id: string;
  /** ISO 日期 YYYY-MM-DD */
  date: string;
  /** 第几天(自记录起) */
  day: number;
  stage: number; // 1..5
  reading: AffectReading;
  params: SpaceParameters;
  seed: number;
  /** 当日聚合指标(用于 Observation Deck 标注) */
  metrics: {
    mean: number; // 0..100
    peak: number; // 0..100
    volatility: number; // 0..1
    confidence: number; // 0..1
    snapshots: number;
    keywords: string[];
  };
  capturedAt: string; // HH:MM
}

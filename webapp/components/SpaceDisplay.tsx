"use client";

/* ============================================================
   SpaceDisplay — 空间的「display」级呈现(对标 P46 观景台)
   深色电影舞台 + 矢量等距网格 + 漂浮渲染图(带景深/投影) + 玻璃 HUD。
   内容层(layers)来自合成器:占位期是单张渲染图,图库就位后是
   地块/建筑/植被/人物/天气多层叠合 → 直接达到 P46 级。
   ============================================================ */

import Image from "next/image";
import s from "./SpaceDisplay.module.css";

export interface SpaceDisplayProps {
  layers: string[];
  emotionLabel: string;
  score: number;
  energy: number;
  pleasantness: number;
  confidence: number;
  weatherLabel: string;
  cue?: string;
  chips?: { label: string; value: string }[];
}

const pct = (n: number) => Math.round(n * 100) + "%";

/** 矢量等距地面网格:正方形网格经 scale(1,.5)+rotate(45) 投成等距菱形栅格 */
function IsoGrid() {
  const S = 132;
  const STEP = 18.857; // ≈ 14 格
  const ticks: number[] = [];
  for (let k = -S; k <= S + 0.1; k += STEP) ticks.push(Number(k.toFixed(2)));
  return (
    <svg className={s.grid} viewBox="0 0 400 300" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <g transform="translate(200 168) scale(1 0.5) rotate(45)">
        {ticks.map((k) => (
          <line key={`v${k}`} x1={k} y1={-S} x2={k} y2={S} />
        ))}
        {ticks.map((k) => (
          <line key={`h${k}`} x1={-S} y1={k} x2={S} y2={k} />
        ))}
      </g>
    </svg>
  );
}

export default function SpaceDisplay({
  layers,
  emotionLabel,
  score,
  energy,
  pleasantness,
  confidence,
  weatherLabel,
  cue,
  chips,
}: SpaceDisplayProps) {
  return (
    <div className={s.display}>
      <div className={s.stage}>
        <IsoGrid />
        <div className={s.platform}>
          <span className={s.shadow} aria-hidden="true" />
          {layers.map((src, i) => (
            <Image
              key={src + i}
              className={s.layer}
              src={src}
              alt={i === 0 ? `Generated space — ${emotionLabel}` : ""}
              fill
              sizes="(max-width: 480px) 92vw, 380px"
              priority={i === 0}
            />
          ))}
        </div>

        <div className={s.hudTop}>
          <span className={s.chip}>
            <span className={s.recDot} aria-hidden="true" />
            {emotionLabel}
          </span>
          <span className={s.chip}>{weatherLabel}</span>
        </div>

        <div className={s.scoreTag}>
          <b>{score.toFixed(2)}</b>
          <span>intensity</span>
        </div>
      </div>

      <div className={s.caption}>
        <div className={s.metrics}>
          <div className={s.metric}><b>{pct(energy)}</b><span>Energy</span></div>
          <div className={s.metric}><b>{pct(pleasantness)}</b><span>Pleasant</span></div>
          <div className={s.metric}><b>{pct(confidence)}</b><span>Confidence</span></div>
        </div>
        {chips && chips.length > 0 && (
          <div className={s.chipRow}>
            {chips.map((c) => (
              <span key={c.label} className={s.metaChip}>
                {c.label} <b>{c.value}</b>
              </span>
            ))}
          </div>
        )}
        {cue && <p className={s.cue}>{cue}</p>}
      </div>
    </div>
  );
}

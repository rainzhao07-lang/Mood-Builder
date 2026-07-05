"use client";

import { useMemo, useState } from "react";
import styles from "./translation.module.css";
import {
  EMOTION_DB,
  MATERIALS,
  PLANTS,
  WHEEL_ORDER,
} from "@/lib/engine/translation-db";
import type { EmotionKey } from "@/lib/engine/types";

const CX = 180;
const CY = 180;
const R = 120;
const rad = (deg: number) => (deg * Math.PI) / 180;
const onCircle = (deg: number, r: number) => ({
  x: CX + r * Math.sin(rad(deg)),
  y: CY - r * Math.cos(rad(deg)),
});

function MaterialVisual({ name }: { name: string }) {
  const kind = name.toLowerCase();
  return (
    <div className={styles.visual}>
      {kind.includes("concrete") && <ConcreteTexture />}
      {kind.includes("marble") && <MarbleTexture />}
      {kind.includes("wood") && <WoodTexture />}
      {kind.includes("glass") && <GlassTexture />}
      {kind.includes("granite") && <GraniteTexture />}
      {kind.includes("steel") && <SteelTexture />}
    </div>
  );
}

function ConcreteTexture() {
  return (
    <svg viewBox="0 0 160 104" className={styles.visualSvg} aria-hidden="true">
      <rect className={styles.svgSurface} x="8" y="10" width="144" height="84" rx="12" />
      {Array.from({ length: 30 }, (_, i) => (
        <circle className={styles.svgSpeck} key={i} cx={16 + (i * 37) % 128} cy={18 + (i * 19) % 68} r={(i % 3) + 1} />
      ))}
      <path className={styles.svgLine} d="M34 22 L56 42 L48 72 M91 18 L82 47 L104 76" />
    </svg>
  );
}

function MarbleTexture() {
  return (
    <svg viewBox="0 0 160 104" className={styles.visualSvg} aria-hidden="true">
      <rect className={styles.svgWhite} x="8" y="10" width="144" height="84" rx="12" />
      <path className={styles.svgLine} d="M15 72 C42 54 45 30 74 36 C96 41 96 72 137 56" />
      <path className={styles.svgSoftLine} d="M21 32 C46 43 51 66 78 64 C105 63 116 30 146 34" />
      <path className={styles.svgSoftLine} d="M48 15 C61 30 64 49 86 50" />
    </svg>
  );
}

function WoodTexture() {
  return (
    <svg viewBox="0 0 160 104" className={styles.visualSvg} aria-hidden="true">
      <rect className={styles.svgSurface} x="8" y="10" width="144" height="84" rx="12" />
      {Array.from({ length: 7 }, (_, i) => (
        <path className={styles.svgSoftLine} key={i} d={`M16 ${22 + i * 10} C45 ${14 + i * 11} 80 ${32 + i * 6} 146 ${20 + i * 9}`} />
      ))}
      <ellipse className={styles.svgLineNoFill} cx="86" cy="52" rx="18" ry="8" />
    </svg>
  );
}

function GlassTexture() {
  return (
    <svg viewBox="0 0 160 104" className={styles.visualSvg} aria-hidden="true">
      <rect className={styles.svgWhite} x="18" y="16" width="124" height="72" rx="10" />
      <path className={styles.svgPanel} d="M36 20 L118 20 L100 88 L20 88 Z" />
      <path className={styles.svgLine} d="M50 21 L33 86 M91 21 L76 86 M124 28 L107 85" />
      <path className={styles.svgHighlight} d="M44 28 L83 28 M37 42 L65 42" />
    </svg>
  );
}

function GraniteTexture() {
  return (
    <svg viewBox="0 0 160 104" className={styles.visualSvg} aria-hidden="true">
      <rect className={styles.svgSurface} x="8" y="10" width="144" height="84" rx="12" />
      {Array.from({ length: 54 }, (_, i) => (
        <circle className={i % 4 === 0 ? styles.svgDarkSpeck : styles.svgSpeck} key={i} cx={15 + (i * 29) % 132} cy={18 + (i * 17) % 70} r={(i % 2) + 1.2} />
      ))}
    </svg>
  );
}

function SteelTexture() {
  return (
    <svg viewBox="0 0 160 104" className={styles.visualSvg} aria-hidden="true">
      <rect className={styles.svgSurface} x="8" y="10" width="144" height="84" rx="12" />
      {Array.from({ length: 12 }, (_, i) => (
        <path className={styles.svgSoftLine} key={i} d={`M16 ${18 + i * 6} H144`} />
      ))}
      <path className={styles.svgHighlight} d="M32 26 H128 M24 52 H136" />
    </svg>
  );
}

function PlantVisual({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 160 104" className={styles.visualSvg} aria-hidden="true">
      <rect className={styles.svgWhite} x="8" y="10" width="144" height="84" rx="12" />
      <path className={styles.svgGround} d="M28 78 C58 64 100 68 132 76" />
      {kind.includes("pine") && (
        <>
          <path className={styles.svgShape} d="M78 24 L54 58 H66 L48 82 H112 L94 58 H106 Z" />
          <path className={styles.svgLine} d="M80 42 V84" />
        </>
      )}
      {kind.includes("blossom") && (
        <>
          <path className={styles.svgLine} d="M82 84 C78 58 72 42 56 28 M84 78 C93 55 106 46 126 36" />
          {Array.from({ length: 20 }, (_, i) => (
            <circle className={styles.svgSpeck} key={i} cx={44 + (i * 23) % 82} cy={22 + (i * 17) % 46} r="3" />
          ))}
        </>
      )}
      {kind.includes("shrub") && (
        <>
          {Array.from({ length: 7 }, (_, i) => (
            <circle className={styles.svgShape} key={i} cx={46 + i * 12} cy={64 - (i % 3) * 7} r={15 - (i % 2) * 2} />
          ))}
        </>
      )}
      {kind.includes("canna") && (
        <>
          {Array.from({ length: 8 }, (_, i) => (
            <path className={styles.svgShape} key={i} d={`M${42 + i * 10} 82 C${34 + i * 10} 58 ${38 + i * 10} 36 ${54 + i * 10} 24 C${55 + i * 10} 52 ${54 + i * 10} 66 ${42 + i * 10} 82`} />
          ))}
        </>
      )}
    </svg>
  );
}

function WeatherVisual({ weather }: { weather: string }) {
  const key = weather.toLowerCase();
  return (
    <svg viewBox="0 0 160 104" className={styles.visualSvg} aria-hidden="true">
      <rect className={styles.svgWhite} x="8" y="10" width="144" height="84" rx="12" />
      <circle className={styles.svgShape} cx="54" cy="40" r="20" />
      <path className={styles.svgSurface} d="M52 62 C60 46 76 45 84 56 C94 44 116 50 120 67 C105 75 70 75 52 62Z" />
      {(key.includes("rain") || key.includes("storm")) && (
        <>
          {Array.from({ length: 8 }, (_, i) => (
            <path className={styles.svgLine} key={i} d={`M${42 + i * 12} 70 L${35 + i * 12} 90`} />
          ))}
        </>
      )}
      {key.includes("snow") && Array.from({ length: 12 }, (_, i) => (
        <circle className={styles.svgSpeck} key={i} cx={32 + (i * 19) % 96} cy={48 + (i * 13) % 42} r="2" />
      ))}
      {key.includes("storm") && <path className={styles.svgHighlight} d="M96 44 L78 69 H94 L78 92" />}
    </svg>
  );
}

function LightVisual() {
  return (
    <svg viewBox="0 0 160 104" className={styles.visualSvg} aria-hidden="true">
      <rect className={styles.svgWhite} x="8" y="10" width="144" height="84" rx="12" />
      <path className={styles.svgPanel} d="M80 22 L126 84 H34 Z" />
      <circle className={styles.svgShape} cx="80" cy="28" r="12" />
      <path className={styles.svgLine} d="M80 40 V84 M58 56 H102" />
    </svg>
  );
}

function SoundVisual() {
  return (
    <svg viewBox="0 0 160 104" className={styles.visualSvg} aria-hidden="true">
      <rect className={styles.svgWhite} x="8" y="10" width="144" height="84" rx="12" />
      <path className={styles.svgSoftLine} d="M18 54 H142" />
      <path className={styles.svgLineNoFill} d="M18 54 C28 34 35 76 45 54 C55 32 64 80 75 54 C87 28 96 82 108 54 C120 36 132 68 142 54" />
    </svg>
  );
}

function StyleVisual() {
  return (
    <svg viewBox="0 0 160 104" className={styles.visualSvg} aria-hidden="true">
      <rect className={styles.svgWhite} x="8" y="10" width="144" height="84" rx="12" />
      <path className={styles.svgPanel} d="M36 84 H124 V72 H36 Z" />
      <path className={styles.svgShape} d="M50 72 V40 H66 V72 M78 72 V30 H94 V72 M106 72 V46 H122 V72" />
      <path className={styles.svgLine} d="M42 40 L86 20 L130 40" />
    </svg>
  );
}

export default function TranslationExplorer() {
  const [sel, setSel] = useState<EmotionKey>("calm");
  const db = EMOTION_DB[sel];
  const primaryPlant = db.vegetation.kinds[0] ?? "shrub";

  const cards = useMemo(() => [
    { k: "Style", v: db.architectureStyle, visual: <StyleVisual /> },
    { k: "Material", v: db.material.name, visual: <MaterialVisual name={db.material.name} /> },
    { k: "Roof", v: db.roofForm, visual: <StyleVisual /> },
    { k: "Vegetation", v: db.vegetation.kinds.join(" / "), visual: <PlantVisual kind={primaryPlant} /> },
    { k: "Light", v: db.light.source, visual: <LightVisual /> },
    { k: "Sound", v: db.sound.source, visual: <SoundVisual /> },
    { k: "Weather", v: db.weather.split(" ")[0], visual: <WeatherVisual weather={db.weather} /> },
  ], [db, primaryPlant]);

  return (
    <section className={styles.explorer}>
      <div className={styles.wheelCol}>
        <svg className={styles.wheelSvg} viewBox="-40 -20 440 400" role="group" aria-label="Emotion family selector">
          {WHEEL_ORDER.map((o) => {
            const p = onCircle(o.angle, R);
            return (
              <line
                key={`l-${o.key}`}
                className={`${styles.spokeLine} ${o.key === sel ? styles.spokeLineOn : ""}`}
                x1={CX}
                y1={CY}
                x2={p.x}
                y2={p.y}
              />
            );
          })}
          {WHEEL_ORDER.map((o) => {
            const p = onCircle(o.angle, R);
            const lp = onCircle(o.angle, R + 26);
            const on = o.key === sel;
            return (
              <g key={o.key} onClick={() => setSel(o.key)} style={{ cursor: "pointer" }}>
                <circle className={`${styles.spokeDot} ${on ? styles.spokeDotOn : ""}`} cx={p.x} cy={p.y} r={on ? 13 : 8} />
                <text className={`${styles.spokeLabel} ${on ? styles.spokeLabelOn : ""}`} x={lp.x} y={lp.y + 3} textAnchor="middle">
                  {EMOTION_DB[o.key].label}
                </text>
              </g>
            );
          })}
          <text className={styles.centerSub} x={CX} y={CY - 10} textAnchor="middle">Emotion</text>
          <text className={styles.centerLabel} x={CX} y={CY + 16} textAnchor="middle" fontSize="24">{db.label}</text>
        </svg>
        <p className={styles.selectorNote}>{db.styleLogic}</p>
      </div>

      <div className={styles.detail} key={sel}>
        {cards.map((card, i) => (
          <article className={styles.domainCard} key={card.k} style={{ animationDelay: `${i * 55}ms` }}>
            {card.visual}
            <div className={styles.domainK}>{card.k}</div>
            <div className={styles.domainV}>{card.v}</div>
          </article>
        ))}
      </div>

      <section className={styles.atlas} aria-label="Material visual atlas">
        <div className={styles.atlasHead}>
          <h2>Material atlas</h2>
          <span>Programmatic visual samples, no external imagery</span>
        </div>
        <div className={styles.materialGrid}>
          {MATERIALS.map((material) => (
            <article className={styles.materialCard} key={material.name}>
              <MaterialVisual name={material.name} />
              <div className={styles.domainK}>{material.name}</div>
              <p>{material.perception}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.plantStrip} aria-label="Plant reference strip">
        {PLANTS.map((plant) => (
          <article className={styles.plantCard} key={plant.name}>
            <PlantVisual kind={plant.name.toLowerCase().includes("pine") ? "pine" : plant.name.toLowerCase().includes("canna") ? "canna" : plant.name.toLowerCase().includes("hydrangea") ? "shrub" : "blossom"} />
            <div>
              <b>{plant.name}</b>
              <span>{plant.height} · {plant.areas}</span>
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}

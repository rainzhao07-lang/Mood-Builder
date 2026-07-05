"use client";

import { useMemo, useState } from "react";
import EmotionWheel from "@/components/EmotionWheel";
import { evolve, vectorFromWheel } from "@/lib/engine/evolution-engine";
import { mixFromVector } from "@/lib/engine/mix";
import { composeSpace, makeSeed } from "@/lib/engine/composer";
import { weatherFromReading, WEATHER_LABEL } from "@/lib/engine/weather";
import styles from "./logic.module.css";

const pct = (n: number) => Math.round(n * 100);

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className={styles.sliderRow}>
      <span className={styles.sliderTop}>
        <span>{label}</span>
        <span>{value.toFixed(step < 1 ? 2 : 0)}{unit}</span>
      </span>
      <input
        className={styles.range}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export default function LogicDiagram() {
  const [angle, setAngle] = useState(60);
  const [radius, setRadius] = useState(0.72);
  const [hrv, setHrv] = useState(72);
  const [skinConductance, setSkinConductance] = useState(0.28);
  const [motion, setMotion] = useState(0.12);

  const { reading, params, mix, space, weather } = useMemo(() => {
    const subjective = { vector: vectorFromWheel(angle, radius) };
    const physio = { hrv, skinConductance, motion };
    const result = evolve(subjective, physio);
    const seed = makeSeed(
      result.params.emotion,
      Math.round(result.reading.energy * 20),
      Math.round(result.reading.pleasantness * 20),
      Math.round(radius * 10)
    );

    return {
      ...result,
      mix: mixFromVector(result.reading.vector),
      space: composeSpace(result.params, seed),
      weather: weatherFromReading(result.reading.energy, result.reading.pleasantness),
    };
  }, [angle, radius, hrv, skinConductance, motion]);

  const domains = [
    { key: "Vegetation", value: `${Math.round(params.vegetationDensity * 100)}% density` },
    { key: "Materials", value: params.material },
    { key: "Roof", value: params.roofForm },
    { key: "Components", value: `${space.blocks.length} massing parts` },
    { key: "Circulation", value: `${params.circulationTurns} turns` },
    { key: "Undulations", value: `${Math.round(params.massingComplexity * 100)}% complexity` },
  ];

  const chain = [
    "Subjective input",
    "Objective input",
    "Emotion State Engine",
    "Spatial State Engine",
    "Temporal layer",
  ];

  return (
    <>
      <section className={styles.logicShell} aria-label="Interactive emotion-to-space logic diagram">
        <aside className={styles.controlPanel}>
          <div className={styles.panelTop}>
            <h2 className={styles.panelTitle}>Current feeling</h2>
            <span className="kicker">{params.emotionLabel} · {reading.score.toFixed(2)}</span>
          </div>
          <p className={styles.hint}>
            Move the marker or the physiological sliders. The mix, translation domains and output parameters update from the same engine used by the 3D model.
          </p>
          <div className={styles.wheelBox}>
            <EmotionWheel
              angle={angle}
              radius={radius}
              onChange={(nextAngle, nextRadius) => {
                setAngle(nextAngle);
                setRadius(nextRadius);
              }}
            />
          </div>
          <div className={styles.sliderStack}>
            <Slider label="Heart-rate variability" value={hrv} min={20} max={100} step={1} unit=" ms" onChange={setHrv} />
            <Slider label="Skin conductance" value={skinConductance} min={0} max={1} step={0.01} onChange={setSkinConductance} />
            <Slider label="Motion" value={motion} min={0} max={1} step={0.01} onChange={setMotion} />
          </div>
        </aside>

        <div className={styles.diagramPanel}>
          <div className={styles.panelTop}>
            <h2 className={styles.panelTitle}>Emotion mix</h2>
            <span className="kicker">Energy {pct(reading.energy)} / Pleasantness {pct(reading.pleasantness)}</span>
          </div>
          <div className={styles.mixGrid}>
            {mix.map((item) => (
              <div className={styles.mixItem} key={item.key}>
                <div className={styles.mixMeta}>
                  <span className={styles.mixLabel}>{item.label}</span>
                  <span className={styles.mixPct}>{item.pct}%</span>
                </div>
                <div className={styles.barTrack} aria-hidden="true">
                  <div className={styles.barFill} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.chain} aria-label="Live translation chain">
            {chain.map((node, index) => (
              <div
                className={`${styles.chainNode} ${index <= 4 ? styles.chainNodeActive : ""}`}
                key={node}
              >
                <span className={styles.nodeIndex}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.nodeTitle}>{node}</span>
              </div>
            ))}
          </div>

          <div className={styles.domainGrid}>
            {domains.map((domain) => (
              <article className={styles.domainCard} key={domain.key}>
                <div className={styles.domainKey}>{domain.key}</div>
                <div className={styles.domainValue}>{domain.value}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.outputPanel}>
        <div className={styles.panelTop}>
          <h2 className={styles.panelTitle}>Design output</h2>
          <span className="kicker">{WEATHER_LABEL[weather]} · {params.architectureStyle}</span>
        </div>
        <div className={styles.outputGrid}>
          <div className={styles.metric}><b>{params.material}</b><span>Material</span></div>
          <div className={styles.metric}><b>{pct(reading.confidence)}%</b><span>Confidence</span></div>
          <div className={styles.metric}><b>{pct(params.verticality)}%</b><span>Verticality</span></div>
          <div className={styles.metric}><b>{WEATHER_LABEL[weather]}</b><span>Weather</span></div>
        </div>
        <p className={styles.hint}>{params.behaviorCue}</p>
      </section>
    </>
  );
}

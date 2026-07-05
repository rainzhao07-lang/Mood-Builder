"use client";

/* ============================================================
   /app — Today(记录流,手机版)
   情绪轮 + 生理信号 → 引擎读数 → 分层合成空间预览 → 存 localStorage。
   文字情绪识别(本地启发式)在下一切片接入。
   ============================================================ */

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import EmotionWheel from "@/components/EmotionWheel";
import { evolve, vectorFromWheel } from "@/lib/engine/evolution-engine";
import { composeSpace, makeSeed } from "@/lib/engine/composer";
import { WEATHER_LABEL } from "@/lib/engine/weather";
import { loadCheckIns, saveCheckIn, todayKey } from "@/lib/app/store";
import type { CheckIn } from "@/lib/app/types";
import shell from "./shell.module.css";
import s from "./today.module.css";

const SpaceViewer = dynamic(() => import("@/components/three/SpaceViewer"), {
  ssr: false,
  loading: () => <div className={s.viewerLoading}>Composing space…</div>,
});

export default function TodayPage() {
  const [angle, setAngle] = useState(60);
  const [radius, setRadius] = useState(0.72);
  const [hrv, setHrv] = useState(72);
  const [restingHr, setRestingHr] = useState(64);
  const [eda, setEda] = useState(0.28);
  const [motion, setMotion] = useState(0.12);

  const [todayCount, setTodayCount] = useState<number | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  // 日期在客户端挂载后才定(预渲染日 ≠ 打开日会触发 hydration mismatch)
  const [dateTag, setDateTag] = useState("");
  const saveResetTimer = useRef<number | null>(null);

  useEffect(() => {
    const date = todayKey();
    setDateTag(date);
    setTodayCount(loadCheckIns().filter((c) => c.date === date).length);
  }, []);

  useEffect(() => {
    return () => {
      if (saveResetTimer.current !== null) window.clearTimeout(saveResetTimer.current);
    };
  }, []);

  const { reading, params } = useMemo(() => {
    const subjective = { vector: vectorFromWheel(angle, radius) };
    const physio = { hrv, restingHr, skinConductance: eda, motion };
    return evolve(subjective, physio);
  }, [angle, radius, hrv, restingHr, eda, motion]);

  const weather = params.weatherMode;

  const space = useMemo(() => {
    const seed = makeSeed(
      params.emotion,
      Math.round(reading.energy * 20),
      Math.round(reading.pleasantness * 20),
      Math.round(radius * 10)
    );
    return composeSpace(params, seed);
  }, [params, reading.energy, reading.pleasantness, radius]);

  function save() {
    const date = todayKey();
    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${date}-${Date.now()}-${space.seed}`;
    const checkIn: CheckIn = {
      id,
      ts: Date.now(),
      date,
      seed: space.seed,
      source: "wheel",
      reading,
      params,
      physio: { hrv, restingHr, eda, motion },
    };
    const all = saveCheckIn(checkIn);
    setTodayCount(all.filter((c) => c.date === date).length);
    setJustSaved(true);
    if (saveResetTimer.current !== null) window.clearTimeout(saveResetTimer.current);
    saveResetTimer.current = window.setTimeout(() => setJustSaved(false), 1800);
  }

  return (
    <div className={shell.page}>
      <header className={shell.pageHead}>
        <div className={shell.eyebrowRow}>
          <span className="kicker">Record</span>
          <span className={shell.dateTag} suppressHydrationWarning>{dateTag || todayKey()}</span>
        </div>
        <h1 className={shell.h1}>How are you, really?</h1>
        <p className={shell.sub}>
          Place yourself on the wheel and let the sensors fill in the rest. Your day
          becomes a space you can revisit.
        </p>
      </header>

      {/* 合成空间:真三维,可旋转 + 第一人称游览 */}
      <SpaceViewer
        space={space}
        weather={weather}
        weatherLabel={WEATHER_LABEL[weather]}
        emotion={params.emotion}
        emotionLabel={params.emotionLabel}
        score={reading.score}
        energy={reading.energy}
        pleasantness={reading.pleasantness}
        confidence={reading.confidence}
        cue={params.behaviorCue}
        chips={[
          { label: "Style", value: params.architectureStyle },
          { label: "Material", value: params.material },
          { label: "Light", value: params.lightSource },
        ]}
      />

      {/* 情绪轮 */}
      <section className={shell.card}>
        <div className={shell.cardHead}>
          <span className={shell.cardTitle}>How you feel</span>
          <span className={shell.cardHint}>Self-report</span>
        </div>
        <div className={s.wheelWrap}>
          <EmotionWheel angle={angle} radius={radius} onChange={(a, r) => { setAngle(a); setRadius(r); }} />
        </div>
        <p className={s.textTeaser}>✎ Describe it in words — local mood reading lands next.</p>
      </section>

      {/* 生理信号 */}
      <section className={shell.card}>
        <div className={shell.cardHead}>
          <span className={shell.cardTitle}>Body signals</span>
          <span className={shell.cardHint}>Simulated wearable</span>
        </div>
        <Slider label="Heart-rate variability" value={hrv} min={20} max={100} step={1} unit=" ms" onChange={setHrv} />
        <Slider label="Resting heart rate" value={restingHr} min={45} max={110} step={1} unit=" bpm" onChange={setRestingHr} />
        <Slider label="Skin conductance" value={eda} min={0} max={1} step={0.01} asPct onChange={setEda} />
        <Slider label="Activity" value={motion} min={0} max={1} step={0.01} asPct onChange={setMotion} />
      </section>

      <button type="button" className={s.saveBtn} onClick={save}>
        {justSaved ? "Saved to today ✓" : "Save this moment"}
      </button>
      {todayCount !== null && (
        <p className={s.countNote}>
          {todayCount === 0 ? "No check-ins yet today." : `${todayCount} check-in${todayCount > 1 ? "s" : ""} today — stored on this device.`}
        </p>
      )}
    </div>
  );
}

function Slider({
  label, value, min, max, step, unit, asPct, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  unit?: string; asPct?: boolean; onChange: (n: number) => void;
}) {
  const display = asPct ? Math.round(value * 100) + "%" : value + (unit ?? "");
  const id = `sig-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className={s.slider}>
      <div className={s.sliderTop}>
        <label htmlFor={id}>{label}</label>
        <b>{display}</b>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

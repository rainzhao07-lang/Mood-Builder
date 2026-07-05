"use client";

/* /app/insights — 趋势与自我觉察(读本地数据)。温和呈现,不下诊断。 */

import { useEffect, useState } from "react";
import { loadCheckIns, groupByDay } from "@/lib/app/store";
import { EMOTION_KEYS, type EmotionKey } from "@/lib/engine/types";
import shell from "../shell.module.css";

const LABEL: Record<EmotionKey, string> = {
  confident: "Confident",
  calm: "Calm",
  joyful: "Joyful",
  scared: "Scared",
  sad: "Sad",
  mad: "Mad",
};

export default function InsightsPage() {
  const [stats, setStats] = useState<null | {
    total: number;
    days: number;
    mean: number;
    dist: Record<EmotionKey, number>;
  }>(null);

  useEffect(() => {
    const all = loadCheckIns();
    const days = groupByDay(all);
    const dist = Object.fromEntries(EMOTION_KEYS.map((k) => [k, 0])) as Record<EmotionKey, number>;
    for (const c of all) dist[c.params.emotion] += 1;
    const mean = all.length ? all.reduce((a, c) => a + c.reading.score, 0) / all.length : 0;
    setStats({ total: all.length, days: days.length, mean, dist });
  }, []);

  if (stats === null) return null;
  const max = Math.max(1, ...Object.values(stats.dist));

  return (
    <div className={shell.page}>
      <header className={shell.pageHead}>
        <span className="kicker">Insights</span>
        <h1 className={shell.h1}>Patterns, gently</h1>
        <p className={shell.sub}>What your records add up to — a mirror, not a diagnosis.</p>
      </header>

      {stats.total === 0 ? (
        <div className={shell.empty}>
          <b>Nothing to reflect on yet</b>
          <span>Save a few moments and your trends appear here.</span>
        </div>
      ) : (
        <>
          <section className={shell.card}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, textAlign: "center" }}>
              <Stat n={String(stats.total)} label="Check-ins" />
              <Stat n={String(stats.days)} label="Days" />
              <Stat n={stats.mean.toFixed(2)} label="Mean score" />
            </div>
          </section>

          <section className={shell.card}>
            <div className={shell.cardHead}>
              <span className={shell.cardTitle}>Emotion mix</span>
              <span className={shell.cardHint}>by check-in</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {EMOTION_KEYS.map((k) => (
                <div key={k} style={{ display: "grid", gridTemplateColumns: "78px 1fr 28px", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--text-body)" }}>{LABEL[k]}</span>
                  <span style={{ height: 8, borderRadius: 999, background: "var(--panel-400)", overflow: "hidden" }}>
                    <span style={{ display: "block", height: "100%", width: `${(stats.dist[k] / max) * 100}%`, background: "var(--interactive)", borderRadius: 999 }} />
                  </span>
                  <b style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--text-strong)", textAlign: "right" }}>
                    {stats.dist[k]}
                  </b>
                </div>
              ))}
            </div>
          </section>

          <p style={{ margin: "6px 2px 0", fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: "var(--leading-snug)" }}>
            Volatility trends, recurring-pattern detection and weekly summaries arrive next.
          </p>
        </>
      )}
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <b style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "var(--numeric-lg)", fontWeight: 500, color: "var(--text-strong)" }}>
        {n}
      </b>
      <span style={{ display: "block", marginTop: 2, fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-muted)" }}>
        {label}
      </span>
    </div>
  );
}

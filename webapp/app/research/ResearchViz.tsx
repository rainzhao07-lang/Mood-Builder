"use client";

/* ============================================================
   Global Research — 数据动效可视化(对标作品集第 3 板)
   · 真·国家级等值世界地图(WorldChoropleth)
   · 疾病负担横条(宽度绘制 + 数字滚动)
   · 流行趋势折线(描线展开)
   · 年龄分布条 · 男女散点
   全部 teal + 白,遵守 prefers-reduced-motion。
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import styles from "./research.module.css";
import WorldChoropleth from "./WorldChoropleth";

const BURDEN = [
  { label: "Depressive disorders", value: 713.4 },
  { label: "Anxiety disorders", value: 510.7 },
  { label: "Schizophrenia", value: 167.8 },
  { label: "Bipolar disorder", value: 101.5 },
  { label: "Eating disorders", value: 43.1 },
];
const BURDEN_MAX = 713.4;

const AGE_BARS = [
  { label: "Ages 70+", value: 5.9 },
  { label: "Ages 60-69", value: 6.4 },
  { label: "Ages 50-59", value: 6.3 },
  { label: "Ages 40-49", value: 6.1 },
  { label: "Ages 30-39", value: 5.7 },
  { label: "Ages 20-29", value: 4.9 },
  { label: "Ages 15-19", value: 3.4 },
  { label: "Ages 5-14", value: 0.7 },
];

const TREND = {
  years: [1990, 1995, 2000, 2005, 2010, 2015, 2021],
  max: 5,
  series: [
    { label: "Anxiety", css: "var(--interactive)", values: [3.8, 3.9, 4.0, 4.0, 4.1, 4.2, 4.6] },
    { label: "Depressive", css: "var(--sage-500)", values: [3.4, 3.5, 3.6, 3.5, 3.6, 3.6, 3.9] },
    { label: "Bipolar", css: "var(--band-500)", values: [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.7] },
  ],
};

const SCATTER = [
  { name: "World", female: 4.5, male: 3.9, size: 32 },
  { name: "North America", female: 7.6, male: 6.4, size: 18 },
  { name: "Europe", female: 5.7, male: 4.8, size: 20 },
  { name: "East Asia", female: 3.8, male: 3.3, size: 16 },
  { name: "South Asia", female: 4.9, male: 4.2, size: 22 },
  { name: "Latin America", female: 6.8, male: 5.6, size: 19 },
];

const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, seen };
}

function useCountUp(target: number, run: boolean, dur = 1100) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setN(target * easeOutCubic(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, dur]);
  return n;
}

function BurdenBar({ label, value, run }: { label: string; value: number; run: boolean }) {
  const n = useCountUp(value, run);
  return (
    <div className={styles.barRow}>
      <span className={styles.barLabel}>{label}</span>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: run ? `${(value / BURDEN_MAX) * 100}%` : "0%" }} />
      </div>
      <span className={styles.barVal}>{n.toFixed(1)}</span>
    </div>
  );
}

function BurdenBars() {
  const { ref, seen } = useInView<HTMLDivElement>();
  return (
    <section className={styles.viz} ref={ref}>
      <div className={styles.vizHead}>
        <h2 className={styles.vizTitle}>Burden of disease, by category</h2>
        <span className={styles.vizCap}>World, 2021 · DALYs (millions)</span>
      </div>
      <div className={styles.bars}>
        {BURDEN.map((b) => (
          <BurdenBar key={b.label} label={b.label} value={b.value} run={seen} />
        ))}
      </div>
    </section>
  );
}

function TrendChart() {
  const { ref, seen } = useInView<HTMLDivElement>();
  const W = 720;
  const H = 260;
  const pad = { l: 34, r: 14, t: 16, b: 28 };
  const x = (i: number) => pad.l + (i / (TREND.years.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => H - pad.b - (v / TREND.max) * (H - pad.t - pad.b);
  const gridY = [0, 1, 2, 3, 4, 5];

  return (
    <section className={styles.viz} ref={ref}>
      <div className={styles.vizHead}>
        <h2 className={styles.vizTitle}>Annual prevalence trends</h2>
        <span className={styles.vizCap}>Share of population · 1990-2021</span>
      </div>
      <div className={styles.chartWrap}>
        <svg className={styles.chart} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Prevalence trends 1990 to 2021">
          {gridY.map((g) => (
            <g key={g}>
              <line className={styles.grid} x1={pad.l} x2={W - pad.r} y1={y(g)} y2={y(g)} />
              <text className={styles.axis} x={pad.l - 8} y={y(g) + 3} textAnchor="end">{g}%</text>
            </g>
          ))}
          {TREND.years.map((yr, i) => (
            <text key={yr} className={styles.axis} x={x(i)} y={H - 8} textAnchor="middle">{yr}</text>
          ))}
          {TREND.series.map((s) => {
            const d = s.values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
            return (
              <path
                key={s.label}
                className={styles.series}
                d={d}
                stroke={s.css}
                pathLength={1}
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: seen ? 0 : 1,
                  transition: "stroke-dashoffset 1.5s var(--ease-settle)",
                }}
              />
            );
          })}
        </svg>
        <div className={styles.legend}>
          {TREND.series.map((s) => (
            <span className={styles.legendItem} key={s.label}>
              <span className={styles.swatch} style={{ background: s.css }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgeBars() {
  return (
    <section className={styles.viz}>
      <div className={styles.vizHead}>
        <h2 className={styles.vizTitle}>Age distribution</h2>
        <span className={styles.vizCap}>Bipolar disorder share, 2021</span>
      </div>
      <div className={styles.ageBars}>
        {AGE_BARS.map((bar) => (
          <div className={styles.ageRow} key={bar.label}>
            <span>{bar.label}</span>
            <i style={{ width: `${(bar.value / 6.5) * 100}%` }} />
            <b>{bar.value.toFixed(1)}%</b>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScatterPlot() {
  const W = 520;
  const H = 280;
  const pad = 34;
  const x = (female: number) => pad + (female / 8) * (W - pad * 2);
  const y = (male: number) => H - pad - (male / 7) * (H - pad * 2);

  return (
    <section className={styles.viz}>
      <div className={styles.vizHead}>
        <h2 className={styles.vizTitle}>Male vs. female share</h2>
        <span className={styles.vizCap}>Anxiety disorders, region comparison</span>
      </div>
      <div className={styles.chartWrap}>
        <svg className={styles.chart} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Male and female mental health share scatter plot">
          {Array.from({ length: 5 }, (_, i) => (
            <g key={i}>
              <line className={styles.grid} x1={pad} x2={W - pad} y1={pad + i * 46} y2={pad + i * 46} />
              <line className={styles.grid} x1={pad + i * 90} x2={pad + i * 90} y1={pad} y2={H - pad} />
            </g>
          ))}
          <path className={styles.gridStrong} d={`M${pad} ${H - pad} L${W - pad} ${pad}`} />
          {SCATTER.map((point) => (
            <g key={point.name}>
              <circle className={styles.scatterDot} cx={x(point.female)} cy={y(point.male)} r={Math.sqrt(point.size) * 2.2} />
              <text className={styles.scatterLabel} x={x(point.female) + 8} y={y(point.male) - 8}>{point.name}</text>
            </g>
          ))}
          <text className={styles.axis} x={W / 2} y={H - 6} textAnchor="middle">Share of female population</text>
          <text className={styles.axis} x={10} y={H / 2} transform={`rotate(-90 10 ${H / 2})`} textAnchor="middle">Share of male population</text>
        </svg>
      </div>
    </section>
  );
}

export default function ResearchViz() {
  return (
    <>
      <WorldChoropleth />
      <div className={styles.vizGrid}>
        <BurdenBars />
        <TrendChart />
        <AgeBars />
        <ScatterPlot />
      </div>
    </>
  );
}

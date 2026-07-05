"use client";

/* ============================================================
   Global Research — 真·国家级等值世界地图
   d3-geo(geoNaturalEarth1)投影 world-atlas topojson(177 国),
   按代表性份额 5 档 teal 上色,hover 出国名 + 数值。
   数据/来源见 worldData.ts(IHME GBD / OWID,代表性数值)。
   ============================================================ */

import { useEffect, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import styles from "./research.module.css";
import { shareFor, binColor, BINS } from "./worldData";

const W = 980;
const H = 500;

type CountryPath = { name: string; d: string };
type Hover = { name: string; v: number | null; x: number; y: number };

export default function WorldChoropleth() {
  const [paths, setPaths] = useState<CountryPath[]>([]);
  const [hover, setHover] = useState<Hover | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/world-110m.json")
      .then((r) => r.json())
      // d3/topojson 的几何边界类型繁琐,这里在边界处用 any 收口
      .then((topo: { objects: { countries: unknown } }) => {
        if (!alive) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fc: any = feature(topo as any, (topo as any).objects.countries);
        const projection = geoNaturalEarth1().fitSize([W, H], fc);
        const path = geoPath(projection);
        const list: CountryPath[] = fc.features
          .filter((f: { properties: { name: string } }) => f.properties.name !== "Antarctica")
          .map((f: { properties: { name: string } }) => ({
            name: f.properties.name,
            d: path(f as never) || "",
          }));
        setPaths(list);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className={styles.mapBoard} aria-label="World mental-health prevalence choropleth">
      <div className={styles.mapHead}>
        <div>
          <div className="kicker">Our World in Data · IHME GBD 2021</div>
          <h2>Share of population with mental &amp; substance disorders</h2>
          <p>Country-level prevalence. Representative values within the documented range — the source CSV is non-redistributable.</p>
        </div>
      </div>

      <div className={styles.mapLayout}>
        <div className={styles.mapStage}>
          <svg className={styles.mapSvg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="World choropleth of mental health prevalence">
            <rect x="0" y="0" width={W} height={H} className={styles.mapOcean} />
            {paths.length === 0 && (
              <text x={W / 2} y={H / 2} textAnchor="middle" className={styles.mapLoading}>Loading map…</text>
            )}
            {paths.map((p) => {
              const v = shareFor(p.name);
              return (
                <path
                  key={p.name}
                  d={p.d}
                  className={styles.geoCountry}
                  fill={v == null ? "var(--surface-card)" : binColor(v)}
                  onPointerMove={(e) =>
                    setHover({ name: p.name, v, x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
                  }
                  onPointerLeave={() => setHover(null)}
                />
              );
            })}
          </svg>
          {hover && (
            <div className={styles.mapTooltip} style={{ left: hover.x + 14, top: hover.y + 12 }}>
              <b>{hover.name}</b>
              <span>{hover.v == null ? "No data" : `${hover.v.toFixed(1)} per 100`}</span>
            </div>
          )}
        </div>

        <aside className={styles.mapPanel}>
          <div className="kicker">Prevalence band</div>
          <div className={styles.binLegend}>
            {BINS.slice().reverse().map((b) => (
              <div className={styles.binRow} key={b.label}>
                <span className={styles.binSwatch} style={{ background: b.color }} />
                {b.label}
              </div>
            ))}
            <div className={styles.binRow}>
              <span className={styles.binSwatch} style={{ background: "var(--surface-card)" }} />
              No data
            </div>
          </div>
          <p className={styles.sourceNote}>Hover a country to read its share — current cases per 100 people.</p>
        </aside>
      </div>

      <div className={styles.sourceRow}>
        <span>Source: IHME, Global Burden of Disease (2021), via Our World in Data</span>
        <a href="https://ourworldindata.org/grapher/share-with-mental-and-substance-disorders" target="_blank" rel="noreferrer">
          Open OWID chart
        </a>
      </div>
    </section>
  );
}

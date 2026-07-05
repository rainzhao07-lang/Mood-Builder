"use client";

/* /app/deck — 时间堆叠(读本地数据)。一屏最多 7 个平台:
   满一周用周平台,否则用当日平台。周融合的等距合成 + 沉浸视图随图库接入。 */

import { useEffect, useState } from "react";
import Image from "next/image";
import { loadCheckIns, groupByDay, groupByWeek } from "@/lib/app/store";
import { composeLayers, intensityFromScore } from "@/lib/app/asset-manifest";
import type { DaySpace } from "@/lib/app/types";
import type { EmotionKey, WeatherMode } from "@/lib/engine/types";
import shell from "../shell.module.css";
import s from "./deck.module.css";

interface Platform {
  key: string;
  title: string;
  emotion: EmotionKey;
  label: string;
  score: number;
  volatility: number;
  weather: WeatherMode;
}

function latestWeatherForDay(day: DaySpace): WeatherMode {
  return day.checkIns[day.checkIns.length - 1]?.params.weatherMode ?? "clear";
}

function latestWeatherForDays(days: DaySpace[]): WeatherMode {
  const lastDay = days[days.length - 1];
  return lastDay ? latestWeatherForDay(lastDay) : "clear";
}

export default function MobileDeckPage() {
  const [platforms, setPlatforms] = useState<Platform[] | null>(null);

  useEffect(() => {
    const days = groupByDay(loadCheckIns());
    const weeks = groupByWeek(days);
    const list: Platform[] =
      weeks.length > 1
        ? weeks.slice(-7).map((w) => ({
            key: w.weekKey,
            title: w.weekKey.replace("-W", " · week "),
            emotion: w.dominant,
            label: w.emotionLabel,
            score: w.days.reduce((a, d) => a + d.meanScore, 0) / w.days.length,
            volatility: w.volatility,
            weather: latestWeatherForDays(w.days),
          }))
        : days.slice(-7).map((d) => ({
            key: d.date,
            title: d.date,
            emotion: d.dominant,
            label: d.emotionLabel,
            score: d.meanScore,
            volatility: d.volatility,
            weather: latestWeatherForDay(d),
          }));
    setPlatforms(list);
  }, []);

  if (platforms === null) return null;

  return (
    <div className={shell.page}>
      <header className={shell.pageHead}>
        <span className="kicker">Observation Deck</span>
        <h1 className={shell.h1}>Your stack</h1>
        <p className={shell.sub}>Each platform is a period of your life as place. Up to seven at a glance.</p>
      </header>

      {platforms.length === 0 ? (
        <div className={shell.empty}>
          <b>No platforms yet</b>
          <span>Record a few moments in Today and your first platform grows here.</span>
        </div>
      ) : (
        <div className={s.stack}>
          {platforms.map((p, i) => {
            const thumb = composeLayers({
              emotion: p.emotion,
              intensity: intensityFromScore(p.score),
              volatility: p.volatility,
              weather: p.weather,
            })[0];
            return (
              <article className={s.platform} key={p.key} style={{ zIndex: platforms.length - i }}>
                <div className={s.thumb}>
                  <Image src={thumb} alt="" fill sizes="120px" style={{ objectFit: "contain" }} />
                </div>
                <div className={s.meta}>
                  <div className={s.metaTop}>
                    <b>{p.label}</b>
                    <span className={s.score}>{p.score.toFixed(2)}</span>
                  </div>
                  <div className={s.metaDate}>{p.title}</div>
                  <div className={s.volTrack}>
                    <div className={s.volFill} style={{ width: `${Math.round(p.volatility * 100)}%` }} />
                  </div>
                  <div className={s.volLabel}>Range {Math.round(p.volatility * 100)}%</div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className={s.foot}>Weekly fusion into a single isometric platform + immersive walk-through arrive with the render library.</p>
    </div>
  );
}

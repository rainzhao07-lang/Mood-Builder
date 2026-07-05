"use client";

import { useState } from "react";
import Image from "next/image";
import type { DailyPlatform, EmotionKey, SpaceParameters } from "@/lib/engine/types";
import s from "./deck.module.css";

/* 真实等距渲染图(public/renders),按情绪/参数映射到三种空间气质 */
const ISO = {
  open: "/renders/space-iso-open.png",
  lush: "/renders/space-iso-lush.png",
  detail: "/renders/space-iso-detail.png",
} as const;

type IsoKind = keyof typeof ISO;

const ISO_DIMS: Record<IsoKind, { w: number; h: number }> = {
  open: { w: 380, h: 290 },
  lush: { w: 392, h: 312 },
  detail: { w: 400, h: 290 },
};

const ISO_BY_EMOTION: Record<EmotionKey, IsoKind> = {
  joyful: "lush", // 茂盛、满绿
  calm: "lush",
  confident: "detail", // 明亮、繁复、有高拱
  mad: "detail",
  sad: "open", // 疏、风化、收敛
  scared: "open",
};

/** 把一天的空间参数映射到一张真实等距渲染图 */
function isoKindFor(p: SpaceParameters): IsoKind {
  if (p.vegetationDensity >= 0.7) return "lush";
  if (p.energy >= 0.7 || p.massingComplexity >= 0.6) return "detail";
  return ISO_BY_EMOTION[p.emotion];
}

function Tile({
  platform,
  delta,
  onSelect,
}: {
  platform: DailyPlatform;
  delta: number;
  onSelect: () => void;
}) {
  const kind = isoKindFor(platform.params);
  const dim = ISO_DIMS[kind];
  const ad = Math.abs(delta);
  const active = delta === 0;
  const style: React.CSSProperties = {
    transform: `translate(${delta * 36}px, ${delta * -48}px) scale(${1 - ad * 0.13})`,
    opacity: 1 - ad * 0.26,
    zIndex: 30 - ad * 6,
  };
  return (
    <button
      type="button"
      className={`${s.tile} ${active ? s.tileActive : ""}`}
      style={style}
      onClick={onSelect}
      aria-label={`Day ${platform.day} · ${platform.params.emotionLabel}`}
      aria-current={active}
      tabIndex={active ? 0 : -1}
    >
      <Image
        className={s.tileImg}
        src={ISO[kind]}
        width={dim.w}
        height={dim.h}
        alt={active ? `Generated space for day ${platform.day}, ${platform.params.emotionLabel}` : ""}
        priority={active}
        sizes="(max-width: 900px) 60vw, 360px"
      />
      {active && (
        <span className={s.tileBadge}>
          Day {platform.day} · {platform.params.emotionLabel}
        </span>
      )}
    </button>
  );
}

export default function DeckView({ platforms }: { platforms: DailyPlatform[] }) {
  const [sel, setSel] = useState(platforms.length - 1);
  const [mode, setMode] = useState<"overview" | "immersive">("overview");
  const active = platforms[sel];
  const maxMean = Math.max(...platforms.map((p) => p.metrics.mean));
  const altitude = (1 + sel * 0.6).toFixed(1);

  // 当前天的前后邻居,作为后方浮层,营造"层叠的时间记录"
  const neighbours = [-2, -1, 1, 2]
    .map((d) => ({ d, i: sel + d }))
    .filter((n) => n.i >= 0 && n.i < platforms.length);

  const tertiary = platforms[Math.max(0, sel - 3)];
  const secondary = platforms[Math.max(0, sel - 1)];

  return (
    <section className={s.deckShell} aria-label="Interactive Observation Deck">
      <div className={s.deckViewport}>
        <button className={`${s.pill} ${s.exit}`} type="button">‹ Exit</button>
        <div className={`${s.pill} ${s.recording}`}>
          <span className={s.recDot} aria-hidden="true" /> Recording {String(active.day).padStart(2, "0")} · {active.capturedAt}
        </div>

        <div className={s.modeStack}>
          <button
            className={`${s.modeButton} ${mode === "overview" ? s.modeButtonActive : ""}`}
            type="button"
            onClick={() => setMode("overview")}
          >
            Overview mode
          </button>
          <button
            className={`${s.modeButton} ${mode === "immersive" ? s.modeButtonActive : ""}`}
            type="button"
            onClick={() => setMode("immersive")}
          >
            Immersive mode
          </button>
        </div>

        <div className={s.altitude}>
          <span className={s.altLabel}>Altitude</span>
          <input
            className={s.altInput}
            type="range"
            min={0}
            max={platforms.length - 1}
            step={1}
            value={sel}
            aria-label="Altitude — select a daily platform"
            onChange={(event) => setSel(Number(event.target.value))}
          />
          <span className={s.altValue}>{altitude}m</span>
        </div>

        {mode === "overview" ? (
          <>
            <div className={s.snapStage} role="group" aria-label="Daily spatial snapshots">
              {neighbours.map((n) => (
                <Tile
                  key={platforms[n.i].id}
                  platform={platforms[n.i]}
                  delta={n.d}
                  onSelect={() => setSel(n.i)}
                />
              ))}
              <Tile key={active.id} platform={active} delta={0} onSelect={() => undefined} />
            </div>

            <Annotation className={s.annotationLeft} platform={tertiary} />
            <Annotation className={s.annotationRight} platform={active} />
            <Annotation className={s.annotationBottom} platform={secondary} />
          </>
        ) : (
          <div className={s.immersive}>
            <div className={s.immersiveFrame}>
              <Image
                className={s.immersiveImg}
                src="/renders/immersive-ruins.png"
                width={384}
                height={762}
                alt="First-person immersive view inside the generated space"
                priority
                sizes="(max-width: 900px) 80vw, 360px"
              />
            </div>
            <div className={`${s.annotation} ${s.compactInfo}`}>
              <AnnotationBody platform={active} />
            </div>
          </div>
        )}

        <div className={s.tracePanel}>
          <div className={s.traceTitle}>
            <span>Affective Trace</span>
            <span>
              {active.params.emotionLabel} {active.reading.score.toFixed(2)}
            </span>
          </div>
          <div className={s.traceBars}>
            {platforms.map((platform, index) => (
              <button
                type="button"
                className={`${s.traceBar} ${index === sel ? s.traceBarActive : ""}`}
                key={platform.id}
                style={{ height: `${Math.max(12, (platform.metrics.mean / maxMean) * 84)}px` }}
                aria-label={`Day ${platform.day}: mean ${platform.metrics.mean}`}
                onClick={() => setSel(index)}
              />
            ))}
          </div>
        </div>

        <div className={`${s.pill} ${s.stageBadge}`}>Stage: Observation Deck · {altitude}m</div>
      </div>
    </section>
  );
}

function Annotation({ className, platform }: { className: string; platform: DailyPlatform }) {
  return (
    <aside className={`${s.annotation} ${className}`}>
      <AnnotationBody platform={platform} />
    </aside>
  );
}

function AnnotationBody({ platform }: { platform: DailyPlatform }) {
  return (
    <>
      <h3>
        Day {platform.day} · {platform.params.emotionLabel}
      </h3>
      <p>
        Date: {platform.date}
        <br />
        Keywords: {platform.metrics.keywords.join(" · ")}
        <br />
        Daily Metrics: mean {platform.metrics.mean}/100 · peak {platform.metrics.peak}/100 · confidence{" "}
        {platform.metrics.confidence.toFixed(2)}
        <br />
        Behavior Cue: {platform.params.behaviorCue}
      </p>
    </>
  );
}

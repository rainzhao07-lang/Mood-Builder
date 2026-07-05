import Link from "next/link";
import styles from "./page.module.css";
import Reveal from "@/components/Reveal";
import { evolve, vectorFromWheel } from "@/lib/engine/evolution-engine";

/**
 * 门户封面。这是一个服务端组件 —— 在请求时真实跑一次引擎,
 * 用算出来的读数替掉作品集里写死的 "Calm 0.62"。
 */
export default function Home() {
  // 一组示例输入:情绪轮偏向 calm + 一份"放松"的生理信号
  const subjective = { vector: vectorFromWheel(60, 0.72) }; // 60° ≈ Calm
  const physio = { hrv: 72, skinConductance: 0.28, motion: 0.12 };
  const { reading, params } = evolve(subjective, physio);

  const pct = (n: number) => (n * 100).toFixed(0) + "%";
  const sections = [
    { href: "/app", idx: "01", title: "The Application", sub: "Record → fuse → generate → temporal → immersive.", tag: "Interactive", feature: true },
    { href: "/research", idx: "02", title: "Global Research", sub: "The mental-health burden this project answers to." },
    { href: "/translation", idx: "03", title: "Translation Database", sub: "Affect mapped to a precise architectural vocabulary." },
    { href: "/logic", idx: "04", title: "Logic Diagram", sub: "Translation domains, inputs and design output." },
    { href: "/deck", idx: "05", title: "Observation Deck", sub: "Daily platforms, stacked into a record of time." },
  ];

  return (
    <main className={styles.cover}>
      <div className={styles.topbar}>
        <div className={`wordmark ${styles.wordmark}`}>Mood <em>Builder</em></div>
        <div className={styles.meta}>Affective Spatial Evolution Framework</div>
      </div>

      <section className={styles.hero}>
        <Reveal aboveFold>
          <h1 className={styles.heroTitle}>
            A space that<br />remembers<br />how you <em>feel.</em>
          </h1>
          <p className={styles.heroLede}>
            Mood Builder translates a person&rsquo;s emotional state into a growable space.
            Each day fuses a subjective self-report with objective physiological signals into an
            emotion vector, then composes a small, weathered, isometric world that stacks over weeks
            into a record you can step inside.
          </p>
          <p className={styles.pipeline}>
            Subjective + Objective input → Emotion State Engine (normalize → weight &amp; fuse → map →
            calibrate) → Spatial State Engine (parameters → domain rules → compose) → Temporal Layer.
          </p>
        </Reveal>

        <Reveal aboveFold className={styles.readout}>
          <div className={styles.readoutHead}>
            <div>
              <div className={styles.readoutVal}>{params.emotionLabel}</div>
              <div className="kicker" style={{ marginTop: 2 }}>Live engine readout</div>
            </div>
            <div className={styles.readoutScore}>{reading.score.toFixed(2)}</div>
          </div>
          <div className={styles.readoutGrid}>
            <div className={styles.readoutItem}><b>{pct(reading.energy)}</b><span>Energy</span></div>
            <div className={styles.readoutItem}><b>{pct(reading.pleasantness)}</b><span>Pleasantness</span></div>
            <div className={styles.readoutItem}><b>{pct(reading.confidence)}</b><span>Confidence</span></div>
            <div className={styles.readoutItem}>
              <b>{pct(reading.weights.objective)} / {pct(reading.weights.subjective)}</b>
              <span>Obj / Subj</span>
            </div>
            <div className={styles.readoutItem}><b>{params.architectureStyle}</b><span>Style</span></div>
            <div className={styles.readoutItem}><b>{params.material}</b><span>Material</span></div>
          </div>
          <p className={styles.readoutNote}>
            Computed by the evolution engine from the current sample state — not a static mock.
          </p>
        </Reveal>
      </section>

      <Reveal as="nav" className={styles.nav} delay={60}>
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className={`${styles.card} ${s.feature ? styles.feature : ""}`}>
            {s.tag ? <span className={styles.cardTag}>{s.tag}</span> : null}
            <span className="idx">{s.idx}</span>
            <div className={styles.cardBody}>
              <div className={styles.cardTitle}>{s.title}</div>
              <div className={styles.cardSub}>{s.sub}</div>
            </div>
          </Link>
        ))}
      </Reveal>

      <div className={styles.footer}>
        <span>Mood Builder — Affective Spatial Evolution Framework</span>
        <span>Academic work · Instructor: Xinyu Tan · 4 March 2026</span>
      </div>
    </main>
  );
}

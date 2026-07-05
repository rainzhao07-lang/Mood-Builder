import Link from "next/link";
import styles from "../boards.module.css";
import Reveal from "@/components/Reveal";
import ResearchViz from "./ResearchViz";
import { RESEARCH_THREADS } from "@/lib/portfolio/content";

export default function ResearchPage() {
  return (
    <main className={styles.board}>
      <div className={styles.top}>
        <Link href="/" className={`${styles.back} ulink`}>‹ Overview</Link>
        <div className="kicker">Global Research</div>
      </div>

      <Reveal as="section" aboveFold className={styles.compactIntro}>
        <h1 className={styles.compactTitle}>
          Research as<br />spatial <em>evidence.</em>
        </h1>
        <p className={styles.compactLede}>
          The map now follows the Our World in Data chart structure: fixed
          prevalence bands, source metadata, and a readable interaction panel.
          It supports the design argument without pretending that a mood score
          is a diagnosis.
        </p>
      </Reveal>

      <ResearchViz />

      <Reveal as="section" className={styles.grid}>
        {RESEARCH_THREADS.map((thread, index) => (
          <article className={`${styles.panel} lift`} key={thread.title}>
            <div className="kicker">{String(index + 1).padStart(2, "0")}</div>
            <h2 className={styles.panelTitle}>{thread.title}</h2>
            <p className={styles.copy}>{thread.claim}</p>
            <p className={styles.note}>{thread.designMove}</p>
          </article>
        ))}
      </Reveal>

    </main>
  );
}

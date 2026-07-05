import Link from "next/link";
import styles from "../boards.module.css";
import Reveal from "@/components/Reveal";
import LogicDiagram from "./LogicDiagram";
import { PHONE_SCREEN_FLOW } from "@/lib/portfolio/content";

export default function LogicPage() {
  return (
    <main className={styles.board}>
      <div className={styles.top}>
        <Link href="/" className={`${styles.back} ulink`}>‹ Overview</Link>
        <div className="kicker">Logic Diagram</div>
      </div>

      <Reveal as="section" aboveFold className={styles.hero}>
        <h1 className={styles.title}>
          A complete<br />translation <em>loop.</em>
        </h1>
        <p className={styles.lede}>
          The product is organised as a closed system: the user reports feeling,
          wearable signals calibrate confidence, the engine maps affect to
          spatial rules, and every generated state becomes part of a temporal
          record.
        </p>
      </Reveal>

      <Reveal as="section">
        <LogicDiagram />
      </Reveal>

      <Reveal as="section" className={styles.panel} style={{ marginTop: 16 }}>
        <h2 className={styles.panelTitle}>14-screen mobile build order</h2>
        <div className={styles.grid} style={{ marginTop: 14 }}>
          {PHONE_SCREEN_FLOW.map((screen) => (
            <div key={screen.id} className={`${styles.panel} lift`}>
              <span className={styles.mono}>{String(screen.id).padStart(2, "0")}</span>
              <h3 className={styles.panelTitle} style={{ fontSize: 18 }}>{screen.name}</h3>
              <p className={styles.copy}>{screen.purpose}</p>
              <p className={styles.note}>{screen.figmaNote}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </main>
  );
}

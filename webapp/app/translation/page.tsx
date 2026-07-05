import Link from "next/link";
import styles from "../boards.module.css";
import Reveal from "@/components/Reveal";
import TranslationExplorer from "./TranslationExplorer";

export default function TranslationPage() {
  return (
    <main className={styles.board}>
      <div className={styles.top}>
        <Link href="/" className={`${styles.back} ulink`}>‹ Overview</Link>
        <div className="kicker">Translation Database</div>
      </div>

      <Reveal as="section" aboveFold className={styles.hero}>
        <h1 className={styles.title}>
          Emotion becomes<br />architectural <em>grammar.</em>
        </h1>
        <p className={styles.lede}>
          Pick an emotion family. The same translation table used by the engine
          turns affect into materials, vegetation, roof form, light, weather and
          sound. The page now treats the database as a visual atlas, not a text list.
        </p>
      </Reveal>

      <Reveal as="section">
        <TranslationExplorer />
      </Reveal>
    </main>
  );
}

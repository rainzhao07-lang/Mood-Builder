import Link from "next/link";
import Image from "next/image";
import styles from "../boards.module.css";
import s from "./deck.module.css";
import Reveal from "@/components/Reveal";
import DeckView from "./DeckView";
import { DAILY_PLATFORMS } from "@/lib/portfolio/content";

export default function DeckPage() {
  return (
    <main className={styles.board}>
      <div className={styles.top}>
        <Link href="/" className={`${styles.back} ulink`}>‹ Overview</Link>
        <div className="kicker">Observation Deck</div>
      </div>

      <Reveal as="section" aboveFold className={styles.hero}>
        <h1 className={styles.title}>
          Fourteen days,<br />stacked as <em>place.</em>
        </h1>
        <p className={styles.lede}>
          Drag the altitude slider, tap a platform, or tap the trace bars. Every
          daily snapshot stays readable as a platform with metrics, affect and
          behavioural cues — turning time into an explorable spatial record.
        </p>
      </Reveal>

      <Reveal className={s.reference}>
        <div className={s.referenceHead}>
          <div className="kicker">Reference capture</div>
          <p>
            The fully rendered observation deck — fourteen daily platforms, ramps and
            annotations in a single frame. The interactive deck below recomposes the
            same record from live engine data.
          </p>
        </div>
        <div className={s.referenceFrame}>
          <Image
            className={s.referenceImg}
            src="/renders/tablet-observation-deck.png"
            width={4961}
            height={3508}
            alt="Rendered observation deck: stacked daily platforms with annotations"
            sizes="(max-width: 900px) 100vw, 1100px"
          />
        </div>
      </Reveal>

      <Reveal>
        <DeckView platforms={DAILY_PLATFORMS} />
      </Reveal>
    </main>
  );
}

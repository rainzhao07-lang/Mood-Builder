/* global React */
const { useState, useEffect, useCallback } = React;
const NSApp = window.MoodBuilderDesignSystem_426a1b;
const { PhoneFrame } = NSApp;

const TOTAL = 10;
const KEY = "mb_screen";

function App() {
  const [i, setI] = useState(() => {
    const s = parseInt(localStorage.getItem(KEY), 10);
    return s >= 1 && s <= TOTAL ? s : 1;
  });
  const go = useCallback((n) => {
    setI(n);
    localStorage.setItem(KEY, String(n));
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" && i < TOTAL) go(i + 1);
      if (e.key === "ArrowLeft" && i > 1) go(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, go]);

  const screen = window.MB_SCREENS[i];
  const Screen = screen.render;

  return (
    <div className="stage">
      <header className="masthead">
        <div className="wordmark">Mood <em>Builder</em></div>
        <p className="tagline">Affective spatial evolution · mobile prototype</p>
        <div className="crumbs">{String(i).padStart(2, "0")} / {TOTAL} · {screen.label}</div>
      </header>

      <PhoneFrame dark={screen.dark}
        screen={screen.dark ? "var(--surface-immersive)" : "var(--surface-screen)"}>
        <div className="screen" key={i}>
          <Screen go={go} />
        </div>
      </PhoneFrame>

      <nav className="dots" aria-label="screens">
        {Array.from({ length: TOTAL }, (_, n) => (
          <button key={n} className={"dot" + (i === n + 1 ? " dot--on" : "")}
            onClick={() => go(n + 1)} aria-label={"Screen " + (n + 1)} />
        ))}
      </nav>
      <div className="navhint">Use ← → or tap a dot to move between screens</div>
    </div>
  );
}

window.MB_App = App;

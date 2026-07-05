import React from "react";

const CSS = `
.mb-wheel-wrap{display:flex;flex-direction:column;align-items:center;gap:18px}
.mb-wheel{width:248px;height:248px;border-radius:50%;position:relative;cursor:pointer;
  background:radial-gradient(circle at 50% 42%, #c2cfca 0%, #aebfb7 70%, #a4b7af 100%);
  touch-action:none;user-select:none}
.mb-wheel__spoke{position:absolute;left:50%;top:50%;width:1px;height:50%;
  background:rgba(255,255,255,.5);transform-origin:top center;transform:translateX(-50%) rotate(var(--a))}
.mb-wheel__lab{position:absolute;left:50%;top:50%;font-size:11px;font-weight:600;
  color:rgba(74,86,82,.7);letter-spacing:.08em;white-space:nowrap;
  transform:translate(-50%,-50%) rotate(var(--r)) translateY(-104px)}
.mb-wheel__dot{position:absolute;width:11px;height:11px;border-radius:50%;
  background:radial-gradient(circle at 40% 35%, #ffffff, #e9efea);
  transform:translate(-50%,-50%);box-shadow:0 0 6px 2px rgba(255,255,255,.5)}
.mb-wheel__marker{position:absolute;width:15px;height:15px;border-radius:50%;
  background:radial-gradient(circle at 40% 35%, #ffffff, #dde7e1);
  transform:translate(-50%,-50%);box-shadow:0 1px 4px rgba(47,62,66,.25), 0 0 10px 3px rgba(255,255,255,.65)}
.mb-wheel__cap{font-family:var(--font-serif-text);font-style:italic;font-weight:500;
  font-size:15px;color:var(--text-body);text-align:center;line-height:1.5}
.mb-wheel__cap b{color:var(--text-strong);font-weight:600}
.mb-wheel__cap .sage{color:var(--sage-600)}
`;

let injected = false;
function ensureCSS() {
  if (injected || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.setAttribute("data-mb", "wheel");
  s.textContent = CSS;
  document.head.appendChild(s);
  injected = true;
}

function quadrant(x, y) {
  const top = y < 0;
  if (Math.abs(x) < 0.18 && Math.abs(y) < 0.18) return "Neutral";
  if (top && x < -0.18) return "Confident";
  if (top && x > 0.18) return "Calm";
  if (!top && x > 0.18) return "Scared";
  if (!top && x < -0.18) return "Joyful";
  return top ? "Calm" : "Sad";
}

// rim labels at angles (deg from top, clockwise); rotation reads tangentially
const LABELS = [
  { t: "CONFIDENT", r: 318 },
  { t: "CALM", r: 42 },
  { t: "SCARED", r: 108 },
  { t: "SAD", r: 152 },
  { t: "MAD", r: 208 },
  { t: "JOYFUL", r: 270 },
];
const SPOKES = [0, 60, 120, 180, 240, 300];
// soft historical sample dots (normalized 0–1)
const SAMPLES = [
  { x: 0.36, y: 0.22 }, { x: 0.52, y: 0.5 }, { x: 0.71, y: 0.42 },
  { x: 0.22, y: 0.62 }, { x: 0.58, y: 0.74 }, { x: 0.3, y: 0.84 },
];

/**
 * Circular self-report control. A flat sage field divided into Calm / Joyful /
 * Sad / Scared / Mad / Confident sectors, scattered with prior sample dots.
 * Drag the bright marker to place today; reports the leaning quadrant.
 */
export function EmotionWheel({ defaultX = 0.62, defaultY = 0.3, onChange, caption = true }) {
  ensureCSS();
  const ref = React.useRef(null);
  const [pos, setPos] = React.useState({ x: defaultX, y: defaultY });
  const [lean, setLean] = React.useState(quadrant(defaultX * 2 - 1, defaultY * 2 - 1));
  const dragging = React.useRef(false);

  const place = React.useCallback((clientX, clientY) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    // clamp within the circle
    let nx = (clientX - r.left) / r.width - 0.5;
    let ny = (clientY - r.top) / r.height - 0.5;
    const d = Math.hypot(nx, ny);
    const max = 0.44;
    if (d > max) { nx = (nx / d) * max; ny = (ny / d) * max; }
    const x = nx + 0.5, y = ny + 0.5;
    const q = quadrant(nx * 2, ny * 2);
    setPos({ x, y });
    setLean(q);
    onChange && onChange(q, { x, y });
  }, [onChange]);

  const onDown = (e) => { dragging.current = true; const t = e.touches ? e.touches[0] : e; place(t.clientX, t.clientY); };
  const onMove = (e) => { if (!dragging.current) return; const t = e.touches ? e.touches[0] : e; place(t.clientX, t.clientY); };
  const onUp = () => { dragging.current = false; };

  return (
    <div className="mb-wheel-wrap">
      <div
        ref={ref} className="mb-wheel"
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      >
        {SPOKES.map((a) => <div key={a} className="mb-wheel__spoke" style={{ "--a": a + "deg" }} />)}
        {LABELS.map((l) => <div key={l.t} className="mb-wheel__lab" style={{ "--r": l.r + "deg" }}>{l.t}</div>)}
        {SAMPLES.map((s, i) => (
          <div key={i} className="mb-wheel__dot" style={{ left: s.x * 100 + "%", top: s.y * 100 + "%" }} />
        ))}
        <div className="mb-wheel__marker" style={{ left: pos.x * 100 + "%", top: pos.y * 100 + "%" }} />
      </div>
      {caption ? (
        <div className="mb-wheel__cap">
          Currently leaning <b>{lean}</b>.<br />
          <span className="sage">Subjective input captured</span>
        </div>
      ) : null}
    </div>
  );
}

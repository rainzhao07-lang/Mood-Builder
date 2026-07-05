/* @ds-bundle: {"format":3,"namespace":"MoodBuilderDesignSystem_426a1b","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"Chip","sourcePath":"components/data/Chip.jsx"},{"name":"ProgressBar","sourcePath":"components/data/ProgressBar.jsx"},{"name":"SignalRow","sourcePath":"components/data/SignalRow.jsx"},{"name":"StageBar","sourcePath":"components/data/StageBar.jsx"},{"name":"PhoneFrame","sourcePath":"components/frame/PhoneFrame.jsx"},{"name":"EmotionWheel","sourcePath":"components/inputs/EmotionWheel.jsx"},{"name":"Slider","sourcePath":"components/inputs/Slider.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"MetricStat","sourcePath":"components/surfaces/Card.jsx"},{"name":"SpaceTile","sourcePath":"components/surfaces/SpaceTile.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"572f800b9b60","components/data/Chip.jsx":"366af85f9f4a","components/data/ProgressBar.jsx":"ebee2827382d","components/data/SignalRow.jsx":"e0bbbb030071","components/data/StageBar.jsx":"071bb2491d15","components/frame/PhoneFrame.jsx":"5f942a29067f","components/inputs/EmotionWheel.jsx":"ab1988f2f917","components/inputs/Slider.jsx":"b1287babce62","components/surfaces/Card.jsx":"167c32f7c8be","components/surfaces/SpaceTile.jsx":"e32f7555cd7f","ui_kits/mood-builder-app/app.jsx":"257bd1edb05b","ui_kits/mood-builder-app/screens.jsx":"5b17606ae2f4"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MoodBuilderDesignSystem_426a1b = window.MoodBuilderDesignSystem_426a1b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.mb-btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  width:100%;box-sizing:border-box;
  cursor:pointer;border:none;
  border-radius:var(--radius-pill);
  transition:transform var(--dur-fast) var(--ease-soft),
             background var(--dur-base) var(--ease-soft),
             color var(--dur-base) var(--ease-soft),
             box-shadow var(--dur-base) var(--ease-soft);
}
.mb-btn:active{transform:scale(.985)}
.mb-btn:disabled{opacity:.4;cursor:not-allowed;transform:none}

/* sizes — serif display CTA text */
.mb-btn--lg{padding:21px 24px;font-family:var(--font-display);font-weight:var(--weight-semibold);
  font-size:21px;letter-spacing:-.005em}
.mb-btn--md{padding:15px 22px;font-family:var(--font-display);font-weight:var(--weight-semibold);
  font-size:17px;letter-spacing:-.005em}
.mb-btn--sm{padding:9px 18px;font-family:var(--font-sans);font-weight:var(--weight-semibold);
  font-size:var(--text-sm);width:auto}

/* — PRIMARY: outlined pill, slate hairline + text, paper interior — */
.mb-btn--primary{background:transparent;color:var(--text-strong);
  box-shadow:inset 0 0 0 1.5px var(--interactive)}
.mb-btn--primary:hover:not(:disabled){background:var(--interactive);color:var(--on-interactive)}

/* — SECONDARY: soft filled panel pill (sits above primary) — */
.mb-btn--secondary{background:var(--surface-card);color:var(--text-strong)}
.mb-btn--secondary:hover:not(:disabled){background:var(--surface-card-deep)}

/* — SOLID: filled slate pill (rare, strong commit) — */
.mb-btn--solid{background:var(--interactive);color:var(--on-interactive)}
.mb-btn--solid:hover:not(:disabled){background:var(--interactive-hover)}

/* — QUIET: text-only back/inline link (sans) — */
.mb-btn--quiet{background:transparent;color:var(--text-body);width:auto;padding:8px 10px;
  font-family:var(--font-sans);font-weight:var(--weight-semibold);font-size:var(--text-sm);
  border-radius:var(--radius-sm)}
.mb-btn--quiet:hover:not(:disabled){color:var(--text-strong)}

/* — ON DARK: outlined pill for immersive screens — */
.mb-btn--onDark{background:transparent;color:var(--text-inverse);
  box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.4)}
.mb-btn--onDark:hover:not(:disabled){background:rgba(255,255,255,.12)}
`;
let injected = false;
function ensureCSS() {
  if (injected || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.setAttribute("data-mb", "button");
  s.textContent = CSS;
  document.head.appendChild(s);
  injected = true;
}
function Button({
  children,
  variant = "primary",
  size = "lg",
  icon = null,
  disabled = false,
  onClick,
  type = "button",
  style,
  ...rest
}) {
  ensureCSS();
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: `mb-btn mb-btn--${variant} mb-btn--${size}`,
    disabled: disabled,
    onClick: onClick,
    style: style
  }, rest), icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/data/Chip.jsx
try { (() => {
const CSS = `
.mb-chip{display:inline-flex;align-items:center;gap:6px;
  font-size:var(--text-2xs);font-weight:var(--weight-semibold);
  padding:5px 11px;border-radius:var(--radius-pill);
  background:var(--surface-card);color:var(--text-body);
  cursor:default;border:none;font-family:var(--font-sans);
  transition:background var(--dur-base) var(--ease-soft),color var(--dur-base) var(--ease-soft);}
.mb-chip--button{cursor:pointer}
.mb-chip--on{background:var(--interactive);color:var(--on-interactive)}
.mb-chip--button:hover{background:var(--panel-400)}
.mb-chip--on.mb-chip--button:hover{background:var(--interactive-hover)}
`;
let injected = false;
function ensureCSS() {
  if (injected || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.setAttribute("data-mb", "chip");
  s.textContent = CSS;
  document.head.appendChild(s);
  injected = true;
}

/** Filter / tag chip. `selected` flips to the slate fill. */
function Chip({
  children,
  selected = false,
  onClick,
  style
}) {
  ensureCSS();
  const isButton = typeof onClick === "function";
  const cls = `mb-chip${selected ? " mb-chip--on" : ""}${isButton ? " mb-chip--button" : ""}`;
  if (isButton) {
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: cls,
      onClick: onClick,
      style: style
    }, children);
  }
  return /*#__PURE__*/React.createElement("span", {
    className: cls,
    style: style
  }, children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Chip.jsx", error: String((e && e.message) || e) }); }

// components/data/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.mb-progress{
  height:5px;background:var(--panel-400);border-radius:var(--radius-pill);
  overflow:hidden;width:100%;
}
.mb-progress__fill{
  display:block;height:100%;border-radius:var(--radius-pill);
  transition:width var(--dur-slow) var(--ease-settle);
}
.mb-progress__fill--gold{background:var(--accent-progress)}
.mb-progress__fill--sage{background:var(--accent-calm)}
.mb-progress__fill--slate{background:var(--interactive)}
`;
let injected = false;
function ensureCSS() {
  if (injected || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.setAttribute("data-mb", "progress");
  s.textContent = CSS;
  document.head.appendChild(s);
  injected = true;
}

/** Thin progress track. `value` 0–100. Color reserved: gold = stage/progress. */
function ProgressBar({
  value = 0,
  color = "gold",
  style,
  ...rest
}) {
  ensureCSS();
  const pct = Math.max(0, Math.min(100, value));
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "mb-progress",
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: `mb-progress__fill mb-progress__fill--${color}`,
    style: {
      width: pct + "%"
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/data/SignalRow.jsx
try { (() => {
const CSS = `
.mb-signal{display:flex;justify-content:space-between;align-items:center;gap:16px;
  padding:15px 0;border-bottom:1px solid var(--border-hairline);}
.mb-signal:last-child{border-bottom:none}
.mb-signal__main{flex:1;min-width:0}
.mb-signal__lab{font-size:var(--text-xs);color:var(--text-body);font-weight:var(--weight-semibold);line-height:1.3}
.mb-signal__tag{font-size:var(--text-3xs);font-weight:var(--weight-bold);letter-spacing:.05em;
  display:inline-flex;align-items:center;gap:5px;margin-top:3px}
.mb-signal__dot{width:6px;height:6px;border-radius:50%;display:inline-block}
.mb-signal__val{font-family:var(--font-display);font-size:var(--numeric-md);color:var(--text-strong);
  font-weight:var(--weight-medium);text-align:right;white-space:nowrap}
.mb-signal__val small{font-family:var(--font-sans);font-size:11px;color:var(--text-body);font-weight:var(--weight-semibold)}
.mb-signal--rest .mb-signal__dot{background:var(--signal-rest)}
.mb-signal--rest .mb-signal__tag{color:var(--sage-600)}
.mb-signal--warn .mb-signal__dot{background:var(--signal-warn)}
.mb-signal--warn .mb-signal__tag{color:var(--gold-600)}
.mb-signal--alert .mb-signal__dot{background:var(--signal-alert)}
.mb-signal--alert .mb-signal__tag{color:var(--signal-alert)}
`;
let injected = false;
function ensureCSS() {
  if (injected || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.setAttribute("data-mb", "signal");
  s.textContent = CSS;
  document.head.appendChild(s);
  injected = true;
}

/**
 * One physiological sensor reading: label + status tag on the left,
 * serif value on the right. Status tints the dot (rest/warn/alert).
 */
function SignalRow({
  label,
  status = "rest",
  statusText,
  value,
  unit,
  style
}) {
  ensureCSS();
  return /*#__PURE__*/React.createElement("div", {
    className: `mb-signal mb-signal--${status}`,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-signal__main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-signal__lab"
  }, label), statusText ? /*#__PURE__*/React.createElement("div", {
    className: "mb-signal__tag"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mb-signal__dot"
  }), statusText) : null), /*#__PURE__*/React.createElement("div", {
    className: "mb-signal__val"
  }, value, unit ? /*#__PURE__*/React.createElement("small", null, " ", unit) : null));
}
Object.assign(__ds_scope, { SignalRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/SignalRow.jsx", error: String((e && e.message) || e) }); }

// components/data/StageBar.jsx
try { (() => {
const CSS = `
.mb-stage{display:flex;align-items:center;gap:9px;margin:4px 0;
  font-size:var(--text-2xs);color:var(--text-body);font-weight:var(--weight-semibold);
  letter-spacing:.02em;}
.mb-stage__bar{flex:1}
.mb-stage__end{color:var(--text-muted)}
`;
let injected = false;
function ensureCSS() {
  if (injected || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.setAttribute("data-mb", "stage");
  s.textContent = CSS;
  document.head.appendChild(s);
  injected = true;
}

/**
 * Stage indicator — "Stage 2 / 5" with a gold progress track and an
 * optional trailing note (e.g. "+3d" until next stage).
 */
function StageBar({
  stage = 2,
  total = 5,
  note,
  style
}) {
  ensureCSS();
  const value = stage / total * 100;
  return /*#__PURE__*/React.createElement("div", {
    className: "mb-stage",
    style: style
  }, /*#__PURE__*/React.createElement("span", null, "Stage ", stage, " / ", total), /*#__PURE__*/React.createElement("span", {
    className: "mb-stage__bar"
  }, /*#__PURE__*/React.createElement(__ds_scope.ProgressBar, {
    value: value,
    color: "gold"
  })), note ? /*#__PURE__*/React.createElement("span", {
    className: "mb-stage__end"
  }, note) : null);
}
Object.assign(__ds_scope, { StageBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StageBar.jsx", error: String((e && e.message) || e) }); }

// components/frame/PhoneFrame.jsx
try { (() => {
const CSS = `
.mb-phone{width:var(--phone-width,340px);height:var(--phone-height,710px);
  background:#11181a;border-radius:var(--radius-phone);padding:11px;position:relative;
  box-shadow:var(--shadow-device), 0 0 0 2px rgba(255,255,255,.04) inset;flex:none}
.mb-phone__notch{position:absolute;top:13px;left:50%;transform:translateX(-50%);
  width:118px;height:26px;background:#11181a;border-radius:0 0 18px 18px;z-index:40}
.mb-phone__vp{width:100%;height:100%;border-radius:var(--radius-2xl);overflow:hidden;
  position:relative;display:flex;flex-direction:column}
.mb-phone__status{height:var(--statusbar-height);display:flex;justify-content:space-between;
  align-items:flex-end;padding:0 24px 6px;font-size:var(--text-xs);font-weight:var(--weight-semibold);
  color:var(--text-strong);flex:none}
.mb-phone__status--dark{color:var(--text-inverse)}
.mb-phone__body{flex:1;display:flex;flex-direction:column;min-height:0}
`;
let injected = false;
function ensureCSS() {
  if (injected || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.setAttribute("data-mb", "phone");
  s.textContent = CSS;
  document.head.appendChild(s);
  injected = true;
}

/**
 * iPhone-style device shell with notch and status bar. Set `screen` to the
 * screen background (default paper). Use `dark` for immersive screens.
 */
function PhoneFrame({
  children,
  screen,
  dark = false,
  time = "9:41",
  style
}) {
  ensureCSS();
  const bg = screen || "var(--surface-screen)";
  return /*#__PURE__*/React.createElement("div", {
    className: "mb-phone",
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-phone__notch"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mb-phone__vp",
    style: {
      background: bg
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `mb-phone__status${dark ? " mb-phone__status--dark" : ""}`
  }, /*#__PURE__*/React.createElement("span", null, time), /*#__PURE__*/React.createElement("span", null, "\u25CF\xA0\u25AA\xA0\u25AE")), /*#__PURE__*/React.createElement("div", {
    className: "mb-phone__body"
  }, children)));
}
Object.assign(__ds_scope, { PhoneFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/frame/PhoneFrame.jsx", error: String((e && e.message) || e) }); }

// components/inputs/EmotionWheel.jsx
try { (() => {
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
const LABELS = [{
  t: "CONFIDENT",
  r: 318
}, {
  t: "CALM",
  r: 42
}, {
  t: "SCARED",
  r: 108
}, {
  t: "SAD",
  r: 152
}, {
  t: "MAD",
  r: 208
}, {
  t: "JOYFUL",
  r: 270
}];
const SPOKES = [0, 60, 120, 180, 240, 300];
// soft historical sample dots (normalized 0–1)
const SAMPLES = [{
  x: 0.36,
  y: 0.22
}, {
  x: 0.52,
  y: 0.5
}, {
  x: 0.71,
  y: 0.42
}, {
  x: 0.22,
  y: 0.62
}, {
  x: 0.58,
  y: 0.74
}, {
  x: 0.3,
  y: 0.84
}];

/**
 * Circular self-report control. A flat sage field divided into Calm / Joyful /
 * Sad / Scared / Mad / Confident sectors, scattered with prior sample dots.
 * Drag the bright marker to place today; reports the leaning quadrant.
 */
function EmotionWheel({
  defaultX = 0.62,
  defaultY = 0.3,
  onChange,
  caption = true
}) {
  ensureCSS();
  const ref = React.useRef(null);
  const [pos, setPos] = React.useState({
    x: defaultX,
    y: defaultY
  });
  const [lean, setLean] = React.useState(quadrant(defaultX * 2 - 1, defaultY * 2 - 1));
  const dragging = React.useRef(false);
  const place = React.useCallback((clientX, clientY) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // clamp within the circle
    let nx = (clientX - r.left) / r.width - 0.5;
    let ny = (clientY - r.top) / r.height - 0.5;
    const d = Math.hypot(nx, ny);
    const max = 0.44;
    if (d > max) {
      nx = nx / d * max;
      ny = ny / d * max;
    }
    const x = nx + 0.5,
      y = ny + 0.5;
    const q = quadrant(nx * 2, ny * 2);
    setPos({
      x,
      y
    });
    setLean(q);
    onChange && onChange(q, {
      x,
      y
    });
  }, [onChange]);
  const onDown = e => {
    dragging.current = true;
    const t = e.touches ? e.touches[0] : e;
    place(t.clientX, t.clientY);
  };
  const onMove = e => {
    if (!dragging.current) return;
    const t = e.touches ? e.touches[0] : e;
    place(t.clientX, t.clientY);
  };
  const onUp = () => {
    dragging.current = false;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mb-wheel-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "mb-wheel",
    onMouseDown: onDown,
    onMouseMove: onMove,
    onMouseUp: onUp,
    onMouseLeave: onUp,
    onTouchStart: onDown,
    onTouchMove: onMove,
    onTouchEnd: onUp
  }, SPOKES.map(a => /*#__PURE__*/React.createElement("div", {
    key: a,
    className: "mb-wheel__spoke",
    style: {
      "--a": a + "deg"
    }
  })), LABELS.map(l => /*#__PURE__*/React.createElement("div", {
    key: l.t,
    className: "mb-wheel__lab",
    style: {
      "--r": l.r + "deg"
    }
  }, l.t)), SAMPLES.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "mb-wheel__dot",
    style: {
      left: s.x * 100 + "%",
      top: s.y * 100 + "%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-wheel__marker",
    style: {
      left: pos.x * 100 + "%",
      top: pos.y * 100 + "%"
    }
  })), caption ? /*#__PURE__*/React.createElement("div", {
    className: "mb-wheel__cap"
  }, "Currently leaning ", /*#__PURE__*/React.createElement("b", null, lean), ".", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "sage"
  }, "Subjective input captured")) : null);
}
Object.assign(__ds_scope, { EmotionWheel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/inputs/EmotionWheel.jsx", error: String((e && e.message) || e) }); }

// components/inputs/Slider.jsx
try { (() => {
const CSS = `
.mb-slider{margin:6px 0}
.mb-slider__label{display:flex;justify-content:space-between;align-items:baseline;
  font-size:var(--text-xs);font-weight:var(--weight-semibold);color:var(--text-body);margin-bottom:9px}
.mb-slider__label b{color:var(--text-strong);font-weight:var(--weight-bold);font-family:var(--font-display);
  font-size:15px;letter-spacing:.01em}
.mb-slider input[type=range]{width:100%;-webkit-appearance:none;appearance:none;height:5px;
  border-radius:var(--radius-pill);background:var(--panel-400);outline:none;margin:0}
.mb-slider input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
  width:20px;height:20px;border-radius:50%;background:var(--interactive);cursor:pointer;
  border:3px solid var(--surface-screen);box-shadow:var(--shadow-thumb)}
.mb-slider input[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;
  background:var(--interactive);cursor:pointer;border:3px solid var(--surface-screen);box-shadow:var(--shadow-thumb)}
`;
let injected = false;
function ensureCSS() {
  if (injected || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.setAttribute("data-mb", "slider");
  s.textContent = CSS;
  document.head.appendChild(s);
  injected = true;
}
function format(v, mode) {
  if (mode === "tone") return v < 33 ? "Cool" : v < 66 ? "Warm" : "Hot";
  if (mode === "layout") return v < 40 ? "Linear" : v < 70 ? "Mixed" : "Organic";
  if (mode === "raw") return String(v);
  return v + "%";
}

/**
 * Labelled range slider for fine-tuning a generated space. `mode` maps the
 * numeric value to a word (tone → Cool/Warm/Hot, layout → Linear/Mixed/Organic)
 * or a percent. Uncontrolled unless `value` + `onChange` are supplied.
 */
function Slider({
  label,
  defaultValue = 50,
  value,
  onChange,
  mode = "percent",
  min = 0,
  max = 100,
  display,
  style
}) {
  ensureCSS();
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const v = controlled ? value : internal;
  const shown = display !== undefined ? display : format(v, mode);
  return /*#__PURE__*/React.createElement("div", {
    className: "mb-slider",
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-slider__label"
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("b", null, shown)), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: min,
    max: max,
    value: v,
    onChange: e => {
      const nv = +e.target.value;
      if (!controlled) setInternal(nv);
      onChange && onChange(nv);
    }
  }));
}
Object.assign(__ds_scope, { Slider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/inputs/Slider.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.mb-card{
  background:var(--surface-card);
  border-radius:var(--radius-lg);
  padding:var(--gap-card);
  box-sizing:border-box;
}
.mb-card--deep{background:var(--surface-card-deep)}
.mb-card--paper{background:var(--paper-200)}
.mb-card--flat{box-shadow:none}
.mb-card--raised{box-shadow:var(--shadow-card)}
.mb-card__k{
  font-size:var(--text-2xs);letter-spacing:.06em;text-transform:uppercase;
  color:var(--text-body);font-weight:var(--weight-semibold);
}
.mb-card__v{
  font-family:var(--font-display);font-size:var(--numeric-lg);
  margin-top:3px;color:var(--text-strong);font-weight:var(--weight-medium);
}
.mb-card__v small{
  font-family:var(--font-sans);font-size:11px;color:var(--text-accent);
  font-weight:var(--weight-semibold);letter-spacing:.04em;
}
`;
let injected = false;
function ensureCSS() {
  if (injected || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.setAttribute("data-mb", "card");
  s.textContent = CSS;
  document.head.appendChild(s);
  injected = true;
}
function Card({
  children,
  tone = "default",
  elevation = "flat",
  style,
  ...rest
}) {
  ensureCSS();
  const toneCls = tone === "default" ? "" : ` mb-card--${tone}`;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `mb-card mb-card--${elevation}${toneCls}`,
    style: style
  }, rest), children);
}

/** A labelled metric: small uppercase key over a serif value. */
function MetricStat({
  label,
  value,
  unit,
  style
}) {
  ensureCSS();
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-card__k"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "mb-card__v"
  }, value, unit ? /*#__PURE__*/React.createElement("small", null, " ", unit) : null));
}
Object.assign(__ds_scope, { Card, MetricStat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/SpaceTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.mb-tile{
  position:relative;border-radius:var(--radius-md);overflow:hidden;
  background:linear-gradient(160deg,#e9ece8,#c8d3cf);
  display:flex;align-items:center;justify-content:center;
}
.mb-tile__img{width:100%;height:100%;object-fit:contain;display:block}
.mb-tile--cover .mb-tile__img{object-fit:cover}
.mb-tile__cap{
  position:absolute;left:12px;bottom:10px;
  font-size:var(--text-3xs);color:#56655f;font-weight:var(--weight-semibold);
  letter-spacing:.04em;opacity:.85;
}
.mb-tile__meta{
  position:absolute;left:14px;right:14px;bottom:12px;
  display:flex;justify-content:space-between;align-items:flex-end;
  font-family:var(--font-display);font-size:13px;color:var(--text-strong);
}
.mb-tile__meta small{font-family:var(--font-sans);font-size:11px;color:var(--text-body);font-weight:var(--weight-semibold)}
.mb-tile__scrim{position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(244,245,242,.85))}
`;
let injected = false;
function ensureCSS() {
  if (injected || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.setAttribute("data-mb", "tile");
  s.textContent = CSS;
  document.head.appendChild(s);
  injected = true;
}

/**
 * Displays one emotion-driven spatial render. Pass `src` for an isometric
 * "space" (contain) or a full immersive photo (`cover`). Optional caption
 * or left/right meta overlay.
 */
function SpaceTile({
  src,
  alt = "spatial render",
  height = 150,
  cover = false,
  caption,
  metaLeft,
  metaRight,
  style,
  ...rest
}) {
  ensureCSS();
  const showMeta = metaLeft || metaRight;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `mb-tile${cover ? " mb-tile--cover" : ""}`,
    style: {
      height,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("img", {
    className: "mb-tile__img",
    src: src,
    alt: alt
  }), showMeta ? /*#__PURE__*/React.createElement("div", {
    className: "mb-tile__scrim"
  }) : null, caption ? /*#__PURE__*/React.createElement("div", {
    className: "mb-tile__cap"
  }, caption) : null, showMeta ? /*#__PURE__*/React.createElement("div", {
    className: "mb-tile__meta"
  }, /*#__PURE__*/React.createElement("span", null, metaLeft), /*#__PURE__*/React.createElement("span", null, metaRight)) : null);
}
Object.assign(__ds_scope, { SpaceTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/SpaceTile.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mood-builder-app/app.jsx
try { (() => {
/* global React */
const {
  useState,
  useEffect,
  useCallback
} = React;
const NSApp = window.MoodBuilderDesignSystem_426a1b;
const {
  PhoneFrame
} = NSApp;
const TOTAL = 10;
const KEY = "mb_screen";
function App() {
  const [i, setI] = useState(() => {
    const s = parseInt(localStorage.getItem(KEY), 10);
    return s >= 1 && s <= TOTAL ? s : 1;
  });
  const go = useCallback(n => {
    setI(n);
    localStorage.setItem(KEY, String(n));
  }, []);
  useEffect(() => {
    const onKey = e => {
      if (e.key === "ArrowRight" && i < TOTAL) go(i + 1);
      if (e.key === "ArrowLeft" && i > 1) go(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, go]);
  const screen = window.MB_SCREENS[i];
  const Screen = screen.render;
  return /*#__PURE__*/React.createElement("div", {
    className: "stage"
  }, /*#__PURE__*/React.createElement("header", {
    className: "masthead"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wordmark"
  }, "Mood ", /*#__PURE__*/React.createElement("em", null, "Builder")), /*#__PURE__*/React.createElement("p", {
    className: "tagline"
  }, "Affective spatial evolution \xB7 mobile prototype"), /*#__PURE__*/React.createElement("div", {
    className: "crumbs"
  }, String(i).padStart(2, "0"), " / ", TOTAL, " \xB7 ", screen.label)), /*#__PURE__*/React.createElement(PhoneFrame, {
    dark: screen.dark,
    screen: screen.dark ? "var(--surface-immersive)" : "var(--surface-screen)"
  }, /*#__PURE__*/React.createElement("div", {
    className: "screen",
    key: i
  }, /*#__PURE__*/React.createElement(Screen, {
    go: go
  }))), /*#__PURE__*/React.createElement("nav", {
    className: "dots",
    "aria-label": "screens"
  }, Array.from({
    length: TOTAL
  }, (_, n) => /*#__PURE__*/React.createElement("button", {
    key: n,
    className: "dot" + (i === n + 1 ? " dot--on" : ""),
    onClick: () => go(n + 1),
    "aria-label": "Screen " + (n + 1)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "navhint"
  }, "Use \u2190 \u2192 or tap a dot to move between screens"));
}
window.MB_App = App;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mood-builder-app/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mood-builder-app/screens.jsx
try { (() => {
/* global React */
// Mood Builder — screen content. Each screen is a function receiving { go }.
const NS = window.MoodBuilderDesignSystem_426a1b;
const {
  Button,
  Card,
  MetricStat,
  StageBar,
  ProgressBar,
  SignalRow,
  Chip,
  Slider,
  EmotionWheel,
  SpaceTile
} = NS;
const {
  useState,
  useRef
} = React;
const R = "../../assets/renders/";

// ---- small local helpers -------------------------------------------------
function Topline({
  back,
  go,
  title,
  right
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "topline"
  }, back ? /*#__PURE__*/React.createElement("span", {
    className: "back",
    onClick: () => go(back)
  }, "\u2039 Back") : /*#__PURE__*/React.createElement("span", null), title ? /*#__PURE__*/React.createElement("span", {
    className: "topline__t"
  }, title) : null, /*#__PURE__*/React.createElement("span", {
    className: "topline__r"
  }, right || ""));
}
function Eyebrow({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, children);
}
function Title({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "title",
    style: style
  }, children);
}
function Note({
  children,
  center,
  strong,
  style
}) {
  return /*#__PURE__*/React.createElement("p", {
    className: "note" + (center ? " note--c" : "") + (strong ? " note--strong" : ""),
    style: style
  }, children);
}

// before/after drag comparison
function ClipCompare() {
  const ref = useRef(null);
  const [p, setP] = useState(50);
  const drag = useRef(false);
  const set = clientX => {
    const r = ref.current.getBoundingClientRect();
    setP(Math.max(4, Math.min(96, (clientX - r.left) / r.width * 100)));
  };
  const down = e => {
    drag.current = true;
    set((e.touches ? e.touches[0] : e).clientX);
  };
  const move = e => {
    if (drag.current) set((e.touches ? e.touches[0] : e).clientX);
  };
  const up = () => {
    drag.current = false;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "cmp",
    ref: ref,
    onMouseDown: down,
    onMouseMove: move,
    onMouseUp: up,
    onMouseLeave: up,
    onTouchStart: down,
    onTouchMove: move,
    onTouchEnd: up
  }, /*#__PURE__*/React.createElement("img", {
    className: "cmp-img",
    src: R + "space-iso-detail.png",
    alt: "after"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cmp-side",
    style: {
      clipPath: `inset(0 ${100 - p}% 0 0)`
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "cmp-img cmp-img--mono",
    src: R + "space-iso-open.png",
    alt: "before"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tagc l"
  }, "BEFORE \xB7 Scared 0.58"), /*#__PURE__*/React.createElement("div", {
    className: "tagc r"
  }, "AFTER \xB7 Calm 0.62"), /*#__PURE__*/React.createElement("div", {
    className: "handle",
    style: {
      left: p + "%"
    }
  }));
}

// ---- 1 · OBSERVE ---------------------------------------------------------
function ScreenObserve({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "body body--center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wordmark-lg"
  }, "Mood ", /*#__PURE__*/React.createElement("em", null, "Builder")), /*#__PURE__*/React.createElement(Title, {
    style: {
      fontSize: "22px",
      textAlign: "center",
      marginTop: "20px"
    }
  }, "A system that translates", /*#__PURE__*/React.createElement("br", null), "emotional states into", /*#__PURE__*/React.createElement("br", null), "evolving spaces."), /*#__PURE__*/React.createElement(Note, {
    center: true,
    style: {
      marginTop: "16px",
      maxWidth: "250px"
    }
  }, "Each day you record how you feel. The space remembers, and grows.")), /*#__PURE__*/React.createElement("div", {
    className: "footer"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => go(2)
  }, "Observe")));
}

// ---- 2 · HOME / PHASE ----------------------------------------------------
function ScreenHome({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement(Topline, {
    title: "",
    right: "Day 14 / Week 3",
    go: go
  }, null), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "Phase"), /*#__PURE__*/React.createElement(Card, {
    style: {
      margin: "10px 0 12px"
    }
  }, /*#__PURE__*/React.createElement(MetricStat, {
    label: "Emotion State",
    value: "Calm",
    unit: "0.62"
  }), /*#__PURE__*/React.createElement(Note, {
    style: {
      marginTop: "8px",
      fontSize: "13px"
    }
  }, "Estimated from subjective and physiological input.")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      top: "8px",
      left: "14px"
    }
  }, "Energy"), /*#__PURE__*/React.createElement("span", {
    style: {
      bottom: "8px",
      right: "14px"
    }
  }, "Pleasantness"), /*#__PURE__*/React.createElement("div", {
    className: "field-dot",
    style: {
      left: "38%",
      top: "44%"
    }
  })), /*#__PURE__*/React.createElement(Card, {
    tone: "paper",
    style: {
      margin: "12px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row-split"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stage-k"
  }, "Stage 2 / 5"), /*#__PURE__*/React.createElement("span", {
    className: "stage-v"
  }, "Spatial State")), /*#__PURE__*/React.createElement(Note, {
    style: {
      margin: "6px 0 10px"
    }
  }, "Spatial system evolving"), /*#__PURE__*/React.createElement(ProgressBar, {
    value: 50,
    color: "gold"
  }), /*#__PURE__*/React.createElement(Note, {
    style: {
      marginTop: "8px",
      fontSize: "12.5px",
      textAlign: "right"
    }
  }, "Next stage in 3 days")), /*#__PURE__*/React.createElement(SpaceTile, {
    src: R + "space-iso-detail.png",
    height: 150
  }), /*#__PURE__*/React.createElement(Note, {
    center: true,
    style: {
      marginTop: "8px",
      fontSize: "13px"
    }
  }, "Spatial configuration at current stage")), /*#__PURE__*/React.createElement("div", {
    className: "footer"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => go(3)
  }, "Record Today"), /*#__PURE__*/React.createElement("div", {
    className: "note note--c",
    style: {
      fontSize: "12.5px"
    }
  }, "Log emotional and physiological inputs")));
}

// ---- 3 · SUBJECTIVE ------------------------------------------------------
function ScreenSubjective({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "body body--center"
  }, /*#__PURE__*/React.createElement(Note, {
    style: {
      position: "absolute",
      top: "10px",
      right: "22px",
      fontSize: "13px"
    }
  }, "Log emotional and physiological signals"), /*#__PURE__*/React.createElement(EmotionWheel, {
    caption: false
  }), /*#__PURE__*/React.createElement(Note, {
    center: true,
    style: {
      marginTop: "16px"
    }
  }, "Place where it feels most accurate to you"), /*#__PURE__*/React.createElement(Note, {
    center: true,
    strong: true,
    style: {
      marginTop: "22px",
      fontSize: "17px"
    }
  }, "Subjective input captured"), /*#__PURE__*/React.createElement(Note, {
    center: true,
    style: {
      marginTop: "18px"
    }
  }, "System calibration in progress")), /*#__PURE__*/React.createElement("div", {
    className: "footer"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => go(4)
  }, "Continue")));
}

// ---- 4 · CALIBRATE -------------------------------------------------------
function ScreenCalibrate({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement(Topline, {
    back: 3,
    go: go
  }), /*#__PURE__*/React.createElement(Title, {
    style: {
      marginTop: "4px"
    }
  }, "Physiological", /*#__PURE__*/React.createElement("br", null), "signals detected"), /*#__PURE__*/React.createElement(Note, {
    style: {
      margin: "6px 0 14px"
    }
  }, "Used to calibrate emotional state."), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: "2px 16px"
    }
  }, /*#__PURE__*/React.createElement(SignalRow, {
    label: "Heart Rate Variability",
    status: "rest",
    statusText: "Stable",
    value: "72",
    unit: "ms"
  }), /*#__PURE__*/React.createElement(SignalRow, {
    label: "Skin Conductance",
    status: "warn",
    statusText: "Tracking",
    value: "Low",
    unit: "fluctuation"
  }), /*#__PURE__*/React.createElement(SignalRow, {
    label: "Motion",
    status: "rest",
    statusText: "Detected",
    value: "Minimal"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "footer"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => go(5)
  }, "Continue")));
}

// ---- 5 · GENERATE --------------------------------------------------------
function ScreenGenerate({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement(Topline, {
    back: 4,
    go: go,
    right: "Space Generated"
  }), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "Space Visualization Section"), /*#__PURE__*/React.createElement(SpaceTile, {
    src: R + "space-iso-open.png",
    height: 196,
    style: {
      marginTop: "12px"
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "genline",
    style: {
      marginTop: "16px"
    }
  }, "Space now feels more ", /*#__PURE__*/React.createElement("b", null, "serene and open"), ", drawn from your Calm state."), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "16px 0 8px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "md",
    onClick: () => go(6)
  }, "Activate Interaction")), /*#__PURE__*/React.createElement(ProgressBar, {
    value: 50,
    color: "sage",
    style: {
      margin: "10px 0 6px"
    }
  }), /*#__PURE__*/React.createElement(Note, {
    center: true,
    style: {
      fontSize: "13px"
    }
  }, "Emotion-driven space generated \xB7 50% complete")), /*#__PURE__*/React.createElement("div", {
    className: "footer"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => go(6)
  }, "Next")));
}

// ---- 6 · ADJUST ----------------------------------------------------------
function ScreenAdjust({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement(Topline, {
    back: 5,
    go: go,
    right: "Space Adjustment"
  }), /*#__PURE__*/React.createElement(SpaceTile, {
    src: R + "space-iso-lush.png",
    height: 154,
    style: {
      marginTop: "4px",
      marginBottom: "16px"
    }
  }), /*#__PURE__*/React.createElement(Slider, {
    label: "Element Density",
    defaultValue: 52,
    mode: "percent"
  }), /*#__PURE__*/React.createElement(Slider, {
    label: "Color Tone",
    defaultValue: 40,
    mode: "tone"
  }), /*#__PURE__*/React.createElement(Slider, {
    label: "Lighting Intensity",
    defaultValue: 63,
    mode: "percent"
  }), /*#__PURE__*/React.createElement(Slider, {
    label: "Layout Style",
    defaultValue: 30,
    mode: "layout"
  })), /*#__PURE__*/React.createElement("div", {
    className: "footer"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => go(7)
  }, "Next")));
}

// ---- 7 · TEMPORAL --------------------------------------------------------
function ScreenTemporal({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement(Topline, {
    back: 6,
    go: go,
    right: "Temporal Layer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "row-split"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Current Snapshot"), /*#__PURE__*/React.createElement("span", {
    className: "stage-k"
  }, "Stage 2 / 5")), /*#__PURE__*/React.createElement(Note, {
    style: {
      margin: "6px 0 10px"
    }
  }, "Time-gated snapshots of evolving space."), /*#__PURE__*/React.createElement(SpaceTile, {
    src: R + "space-iso-lush.png",
    height: 158,
    metaLeft: "Captured \xB7 Day 14 \xB7 09:41",
    metaRight: "Calm \xB7 0.62"
  }), /*#__PURE__*/React.createElement(Note, {
    style: {
      textAlign: "right",
      margin: "6px 0 12px",
      fontSize: "12.5px"
    }
  }, "Drag to rotate \xB7 Pinch to zoom"), /*#__PURE__*/React.createElement(Slider, {
    label: "Time Gate",
    display: "Past \u2192 Now",
    defaultValue: 80,
    mode: "raw"
  }), /*#__PURE__*/React.createElement("div", {
    className: "row-split",
    style: {
      marginTop: "8px"
    }
  }, /*#__PURE__*/React.createElement(Note, {
    strong: true,
    style: {
      fontSize: "13px"
    }
  }, "Selected: Day 11"), /*#__PURE__*/React.createElement("span", {
    className: "delta-pill"
  }, "Lighting \u22128%")), /*#__PURE__*/React.createElement(Note, {
    style: {
      marginTop: "8px",
      fontSize: "12.5px"
    }
  }, "Next update in 3 days.")), /*#__PURE__*/React.createElement("div", {
    className: "footer"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => go(8)
  }, "View Insights")));
}

// ---- 8 · INSIGHTS --------------------------------------------------------
function ScreenInsights({
  go
}) {
  const [day, setDay] = useState("Day 14");
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement(Topline, {
    back: 7,
    go: go,
    title: "Insights",
    right: "Calm \xB7 0.62"
  }), /*#__PURE__*/React.createElement("div", {
    className: "row-split"
  }, /*#__PURE__*/React.createElement(Title, {
    style: {
      margin: 0,
      fontSize: "22px"
    }
  }, "Stage 2 / 5")), /*#__PURE__*/React.createElement(Note, {
    style: {
      margin: "4px 0 12px"
    }
  }, "Last 14 days \xB7 Updated Day 14 \xB7 09:41"), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: "12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Key Changes"), /*#__PURE__*/React.createElement("div", {
    className: "delta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Lighting"), /*#__PURE__*/React.createElement("i", null, "Softer contrast, reduced highlights")), /*#__PURE__*/React.createElement("span", {
    className: "d dn"
  }, "\u22128%")), /*#__PURE__*/React.createElement("div", {
    className: "delta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Element Density"), /*#__PURE__*/React.createElement("i", null, "More vegetation + micro-structures")), /*#__PURE__*/React.createElement("span", {
    className: "d up"
  }, "+12%")), /*#__PURE__*/React.createElement("div", {
    className: "delta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Layout"), /*#__PURE__*/React.createElement("i", null, "Fewer turns, clearer path")), /*#__PURE__*/React.createElement("span", {
    className: "d"
  }, "More linear"))), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: "12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Drivers"), /*#__PURE__*/React.createElement("div", {
    className: "splitbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "o",
    style: {
      width: "55%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "s",
    style: {
      width: "45%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "splitlabels"
  }, /*#__PURE__*/React.createElement("span", null, "Objective Input 55%"), /*#__PURE__*/React.createElement("span", null, "Subjective Input 45%")), /*#__PURE__*/React.createElement(Note, {
    style: {
      marginTop: "10px",
      fontSize: "12.5px"
    }
  }, "HRV remained stable \u2192 calm weighting increased. Your placement confirmed the emotion-space mapping.")), /*#__PURE__*/React.createElement("div", {
    className: "row-split",
    style: {
      margin: "2px 0 8px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "k",
    style: {
      marginBottom: 0
    }
  }, "Archive"), /*#__PURE__*/React.createElement("span", {
    className: "link-q"
  }, "View all")), /*#__PURE__*/React.createElement("div", {
    className: "chiprow"
  }, ["Day 3", "Day 7", "Day 11", "Day 14"].map(d => /*#__PURE__*/React.createElement(Chip, {
    key: d,
    selected: day === d,
    onClick: () => setDay(d)
  }, d))), /*#__PURE__*/React.createElement(Note, {
    style: {
      marginTop: "10px",
      fontSize: "12.5px"
    }
  }, "Tap a day to open its snapshot.")), /*#__PURE__*/React.createElement("div", {
    className: "footer"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => go(9)
  }, "Save Snapshot")));
}

// ---- 9 · COMPARE ---------------------------------------------------------
function ScreenCompare({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement(Topline, {
    back: 8,
    go: go,
    title: "Compare",
    right: "\u22EF"
  }), /*#__PURE__*/React.createElement(Note, {
    style: {
      marginTop: "0"
    }
  }, "Differences between selected snapshots."), /*#__PURE__*/React.createElement("div", {
    className: "cmp-meta"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Day 11 \xB7 22:10"), /*#__PURE__*/React.createElement("i", null, "Scared \xB7 0.58 \xB7 Stage 2 / 5")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("b", null, "Day 14 \xB7 09:41"), /*#__PURE__*/React.createElement("i", null, "Calm \xB7 0.62 \xB7 Stage 2 / 5"))), /*#__PURE__*/React.createElement(ClipCompare, null), /*#__PURE__*/React.createElement(Note, {
    center: true,
    style: {
      margin: "6px 0 0",
      fontSize: "12.5px"
    }
  }, "Change focus: lighting \xB7 vegetation \xB7 path continuity")), /*#__PURE__*/React.createElement("div", {
    className: "footer"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "md",
    onClick: () => go(8)
  }, "Back to Archive"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => go(10)
  }, "Open Timeline")));
}

// ---- 10 · IMMERSIVE ------------------------------------------------------
function ScreenImmersive({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "body body--flush"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imm"
  }, /*#__PURE__*/React.createElement("img", {
    className: "imm-photo",
    src: R + "immersive-ruins.png",
    alt: "immersive interior"
  }), /*#__PURE__*/React.createElement("div", {
    className: "imm-top"
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => go(8)
  }, "\u2039 Back"), /*#__PURE__*/React.createElement("span", null, "Calm \xB7 0.62")), /*#__PURE__*/React.createElement("div", {
    className: "imm-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imm-e"
  }, "Immersive mode \xB7 Day 14"), /*#__PURE__*/React.createElement("div", {
    className: "imm-t"
  }, "Walk inside today"), /*#__PURE__*/React.createElement("div", {
    className: "imm-s"
  }, "A first-person view of the space your mood composed.")))), /*#__PURE__*/React.createElement("div", {
    className: "footer footer--dark"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "onDark",
    onClick: () => go(1)
  }, "Restart flow")));
}
window.MB_SCREENS = {
  1: {
    label: "Observe",
    dark: false,
    render: ScreenObserve
  },
  2: {
    label: "Home / Phase",
    dark: false,
    render: ScreenHome
  },
  3: {
    label: "Subjective",
    dark: false,
    render: ScreenSubjective
  },
  4: {
    label: "Calibrate",
    dark: false,
    render: ScreenCalibrate
  },
  5: {
    label: "Generate",
    dark: false,
    render: ScreenGenerate
  },
  6: {
    label: "Adjust",
    dark: false,
    render: ScreenAdjust
  },
  7: {
    label: "Temporal",
    dark: false,
    render: ScreenTemporal
  },
  8: {
    label: "Insights",
    dark: false,
    render: ScreenInsights
  },
  9: {
    label: "Compare",
    dark: false,
    render: ScreenCompare
  },
  10: {
    label: "Immersive",
    dark: true,
    render: ScreenImmersive
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mood-builder-app/screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.SignalRow = __ds_scope.SignalRow;

__ds_ns.StageBar = __ds_scope.StageBar;

__ds_ns.PhoneFrame = __ds_scope.PhoneFrame;

__ds_ns.EmotionWheel = __ds_scope.EmotionWheel;

__ds_ns.Slider = __ds_scope.Slider;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.MetricStat = __ds_scope.MetricStat;

__ds_ns.SpaceTile = __ds_scope.SpaceTile;

})();

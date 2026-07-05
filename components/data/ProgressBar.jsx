import React from "react";

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
export function ProgressBar({ value = 0, color = "gold", style, ...rest }) {
  ensureCSS();
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="mb-progress" style={style} {...rest}>
      <span className={`mb-progress__fill mb-progress__fill--${color}`} style={{ width: pct + "%" }} />
    </div>
  );
}

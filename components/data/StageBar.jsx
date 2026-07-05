import React from "react";
import { ProgressBar } from "./ProgressBar.jsx";

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
export function StageBar({ stage = 2, total = 5, note, style }) {
  ensureCSS();
  const value = (stage / total) * 100;
  return (
    <div className="mb-stage" style={style}>
      <span>Stage {stage} / {total}</span>
      <span className="mb-stage__bar"><ProgressBar value={value} color="gold" /></span>
      {note ? <span className="mb-stage__end">{note}</span> : null}
    </div>
  );
}

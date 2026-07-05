import React from "react";

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

export function Card({ children, tone = "default", elevation = "flat", style, ...rest }) {
  ensureCSS();
  const toneCls = tone === "default" ? "" : ` mb-card--${tone}`;
  return (
    <div className={`mb-card mb-card--${elevation}${toneCls}`} style={style} {...rest}>
      {children}
    </div>
  );
}

/** A labelled metric: small uppercase key over a serif value. */
export function MetricStat({ label, value, unit, style }) {
  ensureCSS();
  return (
    <div style={style}>
      <div className="mb-card__k">{label}</div>
      <div className="mb-card__v">
        {value}
        {unit ? <small> {unit}</small> : null}
      </div>
    </div>
  );
}

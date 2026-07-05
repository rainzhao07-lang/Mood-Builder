import React from "react";

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
export function Chip({ children, selected = false, onClick, style }) {
  ensureCSS();
  const isButton = typeof onClick === "function";
  const cls = `mb-chip${selected ? " mb-chip--on" : ""}${isButton ? " mb-chip--button" : ""}`;
  if (isButton) {
    return <button type="button" className={cls} onClick={onClick} style={style}>{children}</button>;
  }
  return <span className={cls} style={style}>{children}</span>;
}

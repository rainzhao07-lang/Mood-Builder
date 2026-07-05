import React from "react";

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

export function Button({
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
  return (
    <button
      type={type}
      className={`mb-btn mb-btn--${variant} mb-btn--${size}`}
      disabled={disabled}
      onClick={onClick}
      style={style}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

import React from "react";

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
export function SignalRow({ label, status = "rest", statusText, value, unit, style }) {
  ensureCSS();
  return (
    <div className={`mb-signal mb-signal--${status}`} style={style}>
      <div className="mb-signal__main">
        <div className="mb-signal__lab">{label}</div>
        {statusText ? (
          <div className="mb-signal__tag"><span className="mb-signal__dot" />{statusText}</div>
        ) : null}
      </div>
      <div className="mb-signal__val">
        {value}
        {unit ? <small> {unit}</small> : null}
      </div>
    </div>
  );
}

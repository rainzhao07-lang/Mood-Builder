import React from "react";

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
export function PhoneFrame({ children, screen, dark = false, time = "9:41", style }) {
  ensureCSS();
  const bg = screen || "var(--surface-screen)";
  return (
    <div className="mb-phone" style={style}>
      <div className="mb-phone__notch" />
      <div className="mb-phone__vp" style={{ background: bg }}>
        <div className={`mb-phone__status${dark ? " mb-phone__status--dark" : ""}`}>
          <span>{time}</span><span>&#9679;&nbsp;&#9642;&nbsp;&#9646;</span>
        </div>
        <div className="mb-phone__body">{children}</div>
      </div>
    </div>
  );
}

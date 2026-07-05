import React from "react";

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
export function SpaceTile({
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
  return (
    <div
      className={`mb-tile${cover ? " mb-tile--cover" : ""}`}
      style={{ height, ...style }}
      {...rest}
    >
      <img className="mb-tile__img" src={src} alt={alt} />
      {showMeta ? <div className="mb-tile__scrim" /> : null}
      {caption ? <div className="mb-tile__cap">{caption}</div> : null}
      {showMeta ? (
        <div className="mb-tile__meta">
          <span>{metaLeft}</span>
          <span>{metaRight}</span>
        </div>
      ) : null}
    </div>
  );
}

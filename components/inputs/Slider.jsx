import React from "react";

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
export function Slider({
  label,
  defaultValue = 50,
  value,
  onChange,
  mode = "percent",
  min = 0,
  max = 100,
  display,
  style,
}) {
  ensureCSS();
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const v = controlled ? value : internal;
  const shown = display !== undefined ? display : format(v, mode);
  return (
    <div className="mb-slider" style={style}>
      <div className="mb-slider__label"><span>{label}</span><b>{shown}</b></div>
      <input
        type="range" min={min} max={max} value={v}
        onChange={(e) => {
          const nv = +e.target.value;
          if (!controlled) setInternal(nv);
          onChange && onChange(nv);
        }}
      />
    </div>
  );
}

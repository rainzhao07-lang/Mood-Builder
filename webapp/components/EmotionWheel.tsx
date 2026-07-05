"use client";

/* ============================================================
   Mood Builder — 情绪轮(主观输入)
   六根轴对应 confident/calm/scared/sad/mad/joyful。
   用户把点拖到某个方向与半径 → (angle, radius) → 引擎转成情绪向量。
   0° 指向正上方,顺时针。
   ============================================================ */

import { useRef } from "react";
import { WHEEL_ORDER } from "@/lib/engine/translation-db";
import { EMOTION_DB } from "@/lib/engine/translation-db";

const SIZE = 260;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 104;

/** 取定精度,避免服务端/客户端浮点格式化不一致导致水合报错 */
const r3 = (n: number) => Math.round(n * 1000) / 1000;
function polar(angleDeg: number, radius: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: r3(CX + radius * Math.sin(a)), y: r3(CY - radius * Math.cos(a)) };
}

export default function EmotionWheel({
  angle,
  radius,
  onChange,
}: {
  angle: number;
  radius: number;
  onChange: (angle: number, radius: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const setFromPointer = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * SIZE;
    const py = ((clientY - rect.top) / rect.height) * SIZE;
    const dx = px - CX;
    const dy = py - CY;
    let a = (Math.atan2(dx, -dy) * 180) / Math.PI;
    a = (a + 360) % 360;
    const dist = Math.min(R, Math.hypot(dx, dy));
    onChange(a, dist / R);
  };

  const dot = polar(angle, radius * R);
  const updateByKey = (key: string) => {
    if (key === "ArrowRight") onChange((angle + 5) % 360, radius);
    else if (key === "ArrowLeft") onChange((angle + 355) % 360, radius);
    else if (key === "ArrowUp") onChange(angle, Math.min(1, radius + 0.05));
    else if (key === "ArrowDown") onChange(angle, Math.max(0, radius - 0.05));
    else return false;
    return true;
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="slider"
      tabIndex={0}
      aria-label="Emotion wheel"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(radius * 100)}
      aria-valuetext={`Angle ${Math.round(angle)} degrees, intensity ${Math.round(radius * 100)} percent`}
      style={{ width: "100%", maxWidth: 300, touchAction: "none", cursor: "pointer", userSelect: "none" }}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        setFromPointer(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => dragging.current && setFromPointer(e.clientX, e.clientY)}
      onPointerUp={() => (dragging.current = false)}
      onPointerLeave={() => (dragging.current = false)}
      onKeyDown={(e) => {
        if (updateByKey(e.key)) e.preventDefault();
      }}
    >
      {/* 同心环 */}
      {[0.33, 0.66, 1].map((f) => (
        <circle key={f} cx={CX} cy={CY} r={R * f} fill="none" stroke="var(--line-300)" strokeWidth={1} opacity={0.7} />
      ))}
      {/* 六轴 + 标签 */}
      {WHEEL_ORDER.map(({ key, angle: a }) => {
        const end = polar(a, R);
        const lab = polar(a, R + 16);
        return (
          <g key={key}>
            <line x1={CX} y1={CY} x2={end.x} y2={end.y} stroke="var(--line-200)" strokeWidth={1} />
            <text
              x={lab.x}
              y={lab.y}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.08em",
                fill: "var(--text-body)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {EMOTION_DB[key].label.toUpperCase()}
            </text>
          </g>
        );
      })}
      {/* 当前落点 */}
      <circle cx={dot.x} cy={dot.y} r={11} fill="var(--interactive)" />
      <circle cx={dot.x} cy={dot.y} r={11} fill="none" stroke="var(--paper-100)" strokeWidth={2} />
      <circle cx={CX} cy={CY} r={3} fill="var(--text-muted)" />
    </svg>
  );
}

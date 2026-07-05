"use client";

/* ============================================================
   SpaceViewer — Today 的真三维空间视图(非贴图)。
   两种模式:
   · Rotate  等距相机 + OrbitControls(拖动旋转/缩放)
   · Walk    第一人称(拖动看向 + 虚拟摇杆走动,适配触屏)
   世界内容复用 SpaceScene 的 SceneContents;引擎 composeSpace 驱动。
   ============================================================ */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import { Bloom, BrightnessContrast, DepthOfField, EffectComposer, HueSaturation, Vignette } from "@react-three/postprocessing";
import { useEffect, useRef, useState, type MutableRefObject, type PointerEvent as ReactPointerEvent } from "react";
import * as THREE from "three";
import type { ComposedSpace, EmotionKey, WeatherMode } from "@/lib/engine/types";
import { SceneContents, envFor, type SceneQuality } from "./SpaceScene";
import s from "./SpaceViewer.module.css";

type Mode = "orbit" | "walk";

interface Grade { sat: number; bright: number; contrast: number; }

/** 按情绪的色彩分级:积极→鲜艳,消极→低饱和甚至灰(sat 接近 -1 = 灰阶) */
const GRADE: Record<EmotionKey, Grade> = {
  joyful: { sat: 0.45, bright: 0.05, contrast: 0.08 },
  confident: { sat: 0.22, bright: 0.03, contrast: 0.1 },
  calm: { sat: 0.12, bright: 0.04, contrast: -0.02 },
  mad: { sat: -0.12, bright: -0.05, contrast: 0.26 },
  scared: { sat: -0.68, bright: -0.08, contrast: 0.14 },
  sad: { sat: -0.95, bright: -0.13, contrast: -0.04 },
};

/** 后期:辉光 + 情绪分级 + 暗角常开;景深仅第一人称(透视相机)开 */
function Effects({ dof, grade, quality }: { dof: boolean; grade: Grade; quality: SceneQuality }) {
  const isFull = quality === "full";
  return (
    <EffectComposer multisampling={isFull ? 4 : 0}>
      {dof && isFull ? <DepthOfField focusDistance={0.015} focalLength={0.06} bokehScale={3.2} height={480} /> : <></>}
      <Bloom intensity={isFull ? 0.42 : 0.24} luminanceThreshold={0.7} luminanceSmoothing={0.25} mipmapBlur={isFull} />
      <BrightnessContrast brightness={grade.bright} contrast={grade.contrast} />
      <HueSaturation saturation={grade.sat} />
      <Vignette eskil={false} offset={0.22} darkness={isFull ? 0.72 : 0.52} />
    </EffectComposer>
  );
}
interface Vec2 { x: number; y: number; }
interface Look { dx: number; dy: number; }

interface Chip { label: string; value: string; }

interface Props {
  space: ComposedSpace;
  weather?: WeatherMode;
  weatherLabel: string;
  emotion: EmotionKey;
  emotionLabel: string;
  score: number;
  energy: number;
  pleasantness: number;
  confidence: number;
  cue?: string;
  chips?: Chip[];
}

const pct = (n: number) => Math.round(n * 100) + "%";

/** 第一人称相机装置:每帧根据 look/move 两个 ref 更新透视相机 */
function WalkRig({ move, look }: { move: MutableRefObject<Vec2>; look: MutableRefObject<Look> }) {
  const { camera } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(-0.05);
  const fwd = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const up = useRef(new THREE.Vector3(0, 1, 0));

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    yaw.current -= look.current.dx * 0.0038;
    pitch.current -= look.current.dy * 0.0038;
    pitch.current = Math.max(-0.85, Math.min(0.5, pitch.current));
    look.current.dx = 0;
    look.current.dy = 0;

    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");
    camera.getWorldDirection(fwd.current);
    fwd.current.y = 0;
    fwd.current.normalize();
    right.current.crossVectors(fwd.current, up.current).normalize();

    const speed = 3.4 * d;
    camera.position.addScaledVector(fwd.current, move.current.y * speed);
    camera.position.addScaledVector(right.current, move.current.x * speed);
    camera.position.x = Math.max(-6.2, Math.min(6.2, camera.position.x));
    camera.position.z = Math.max(-4.2, Math.min(4.4, camera.position.z));
    camera.position.y = 1.6;
  });
  return null;
}

function Joystick({ move }: { move: MutableRefObject<Vec2> }) {
  const base = useRef<HTMLDivElement>(null);
  const active = useRef(false);
  const [knob, setKnob] = useState<Vec2>({ x: 0, y: 0 });

  function apply(e: ReactPointerEvent) {
    const el = base.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    let dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    const mag = Math.hypot(dx, dy);
    if (mag > 1) {
      dx /= mag;
      dy /= mag;
    }
    setKnob({ x: dx, y: dy });
    move.current.x = dx;
    move.current.y = -dy; // 上 = 前进
  }
  function down(e: ReactPointerEvent) {
    active.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    apply(e);
  }
  function movePad(e: ReactPointerEvent) {
    if (active.current) apply(e);
  }
  function end() {
    active.current = false;
    setKnob({ x: 0, y: 0 });
    move.current.x = 0;
    move.current.y = 0;
  }

  return (
    <div
      ref={base}
      className={s.joyBase}
      onPointerDown={down}
      onPointerMove={movePad}
      onPointerUp={end}
      onPointerLeave={end}
    >
      <div className={s.joyKnob} style={{ transform: `translate(${knob.x * 26}px, ${knob.y * 26}px)` }} />
    </div>
  );
}

export default function SpaceViewer({
  space,
  weather = "clear",
  weatherLabel,
  emotion,
  emotionLabel,
  score,
  energy,
  pleasantness,
  confidence,
  cue,
  chips,
}: Props) {
  const [mode, setMode] = useState<Mode>("orbit");
  const move = useRef<Vec2>({ x: 0, y: 0 });
  const look = useRef<Look>({ dx: 0, dy: 0 });
  const dragging = useRef(false);
  const last = useRef<Vec2>({ x: 0, y: 0 });
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isFs, setIsFs] = useState(false);
  // 雾浓度/天色随情绪:消极→浓雾压暗(世界收窄),积极→通透开阔
  const env = envFor(weather, emotion);
  // 用户明确:别管性能、要真实 → 始终全质量(阴影/反射/后期/密度全开)
  const quality: SceneQuality = "full";

  useEffect(() => {
    const onFs = () => setIsFs(document.fullscreenElement === viewerRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else viewerRef.current?.requestFullscreen();
  }

  function lookDown(e: ReactPointerEvent) {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function lookMove(e: ReactPointerEvent) {
    if (!dragging.current) return;
    look.current.dx += e.clientX - last.current.x;
    look.current.dy += e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
  }
  function lookUp() {
    dragging.current = false;
  }

  return (
    <div className={s.viewer} ref={viewerRef}>
      <div className={s.stage}>
        <Canvas
          shadows={quality === "full"}
          dpr={quality === "full" ? [1, 1.5] : [1, 1.25]}
          frameloop="always"
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.04;
            gl.shadowMap.type = THREE.PCFShadowMap;
            gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault(), false);
          }}
          resize={{ scroll: false, offsetSize: true }}
          style={{ position: "absolute", inset: 0 }}
        >
          <color attach="background" args={[env.bg]} />
          <fog attach="fog" args={[env.bg, env.near, env.far]} />
          {mode === "orbit" ? (
            <>
              <OrthographicCamera makeDefault position={[11, 9, 11]} zoom={42} near={-50} far={100} />
              <OrbitControls
                enablePan={false}
                minZoom={26}
                maxZoom={90}
                maxPolarAngle={Math.PI / 2.15}
                target={[0, 0.5, 0]}
                makeDefault
              />
            </>
          ) : (
            <>
              <PerspectiveCamera makeDefault fov={70} near={0.08} far={120} position={[0, 1.6, 3.8]} />
              <WalkRig move={move} look={look} />
            </>
          )}
          <SceneContents space={space} weather={weather} quality={quality} />
          <Effects dof={mode === "walk"} grade={GRADE[emotion]} quality={quality} />
        </Canvas>

        {mode === "walk" && (
          <div
            className={s.lookLayer}
            onPointerDown={lookDown}
            onPointerMove={lookMove}
            onPointerUp={lookUp}
            onPointerLeave={lookUp}
          />
        )}
        {mode === "walk" && <Joystick move={move} />}

        <div className={s.hudTop}>
          <span className={s.badge}>
            <span className={s.dot} aria-hidden="true" />
            {emotionLabel} · {score.toFixed(2)}
          </span>
          <span className={s.badge}>{weatherLabel}</span>
        </div>

        <div className={s.modeToggle} role="group" aria-label="View mode">
          <button type="button" className={mode === "orbit" ? s.on : ""} onClick={() => setMode("orbit")}>
            Rotate
          </button>
          <button type="button" className={mode === "walk" ? s.on : ""} onClick={() => setMode("walk")}>
            Walk
          </button>
        </div>

        <button type="button" className={s.fsBtn} onClick={toggleFullscreen} aria-label={isFs ? "Exit fullscreen" : "Enter fullscreen"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {isFs ? (
              <path d="M9 4H5.5a1.5 1.5 0 0 0-1.5 1.5V9M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15M15 20h3.5a1.5 1.5 0 0 0 1.5-1.5V15" />
            ) : (
              <path d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9M20 9V5.5A1.5 1.5 0 0 0 18.5 4H15M4 15v3.5A1.5 1.5 0 0 0 5.5 20H9M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15" />
            )}
          </svg>
        </button>

        <div className={s.hint}>{mode === "orbit" ? "Drag to rotate · pinch to zoom" : "Drag to look · joystick to move"}</div>
      </div>

      <div className={s.caption}>
        <div className={s.metrics}>
          <div className={s.metric}><b>{pct(energy)}</b><span>Energy</span></div>
          <div className={s.metric}><b>{pct(pleasantness)}</b><span>Pleasant</span></div>
          <div className={s.metric}><b>{pct(confidence)}</b><span>Confidence</span></div>
        </div>
        {chips && chips.length > 0 && (
          <div className={s.chipRow}>
            {chips.map((c) => (
              <span key={c.label} className={s.metaChip}>
                {c.label} <b>{c.value}</b>
              </span>
            ))}
          </div>
        )}
        {cue && <p className={s.cue}>{cue}</p>}
      </div>
    </div>
  );
}

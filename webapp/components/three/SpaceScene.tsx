"use client";

/* ============================================================
   SpaceScene — 情绪空间的实时三维世界(写实配色)
   空间内部色系自由,不跟随 App 的 teal:石/木/玻璃/金属 + 绿植/樱花
   + 蓝天/草地/水面 + 彩色人物。六大情绪各自的建筑风格被强化表达。
   SceneContents / ENV 导出给 SpaceViewer 复用。
   ============================================================ */

import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  Line,
  MeshReflectorMaterial,
  OrbitControls,
  RoundedBox,
  Sky,
} from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ComposedSpace, EmotionKey, MassingBlock, VegetationInstance, WeatherMode } from "@/lib/engine/types";

export type SceneQuality = "preview" | "full";

/* ---------- 写实调色板 ---------- */
// 建筑中性(暖石/奶白)
const C = {
  deep: "#5f584c",
  mid: "#8b8474",
  soft: "#aaa290",
  pale: "#ccc6b5",
  mist: "#e8e3d6",
  white: "#f6f3ec",
  black: "#0c0d0f",
} as const;
// 自然色
const NAT = {
  foliageDark: "#3a5a30",
  foliage: "#5a7f3f",
  foliageLight: "#8aa94f",
  blossom: "#f1bcd0",
  blossomLight: "#fbe6ee",
  cannaFlower: "#d24b2e",
  trunk: "#6b4a30",
  grass: "#7c9a54",
  water: "#7fb0c6",
  waterDeep: "#4f8399",
  wood: "#a06b3f",
  woodDark: "#5b3d24",
  metal: "#8b929a",
  metalLine: "#6f767e",
  glass: "#cfe6f0",
  marble: "#f1ede2",
  marbleVein: "#c6c0b0",
  skyBlue: "#bcd8ee",
} as const;
const CLOTHES = ["#b8524a", "#41618f", "#c99a3e", "#4f7a55", "#7a5088", "#3f6f7d", "#b06a3c", "#5a6b8a"] as const;
const SKIN = "#e3c3a3";

type MaterialKind = "stone" | "marble" | "wood" | "glass" | "metal" | "concrete" | "granite";
const textureCache = new Map<MaterialKind, THREE.CanvasTexture>();

function materialKind(name: string): MaterialKind {
  const n = name.toLowerCase();
  if (n.includes("marble")) return "marble";
  if (n.includes("wood")) return "wood";
  if (n.includes("glass")) return "glass";
  if (n.includes("steel") || n.includes("iron")) return "metal";
  if (n.includes("concrete")) return "concrete";
  if (n.includes("granite")) return "granite";
  return "stone";
}

function makeTexture(kind: MaterialKind): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle =
    kind === "glass" ? NAT.glass
    : kind === "metal" ? NAT.metal
    : kind === "wood" ? "#b5895d"
    : kind === "marble" ? NAT.marble
    : kind === "concrete" ? "#c6c5c0"
    : kind === "granite" ? "#8f8d89"
    : C.mist;
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle =
    kind === "marble" ? NAT.marbleVein : kind === "wood" ? NAT.woodDark : kind === "metal" ? NAT.metalLine : C.soft;
  ctx.lineWidth = kind === "metal" ? 1 : 2;

  if (kind === "marble") {
    for (let i = 0; i < 10; i += 1) {
      ctx.beginPath();
      ctx.moveTo(-10, 12 + i * 14);
      ctx.bezierCurveTo(28, i * 18, 70, 88 - i * 3, 140, 20 + i * 10);
      ctx.stroke();
    }
  } else if (kind === "wood") {
    for (let i = 0; i < 15; i += 1) {
      ctx.beginPath();
      ctx.moveTo(0, 8 + i * 8);
      ctx.bezierCurveTo(38, 4 + i * 8, 82, 14 + i * 8, 128, 8 + i * 8);
      ctx.stroke();
    }
  } else if (kind === "metal") {
    for (let i = 0; i < 26; i += 1) {
      ctx.beginPath();
      ctx.moveTo(0, i * 5);
      ctx.lineTo(128, i * 5);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = C.soft;
    for (let i = 0; i < 120; i += 1) {
      ctx.globalAlpha = i % 3 === 0 ? 0.7 : 0.28;
      ctx.beginPath();
      ctx.arc((i * 37) % 128, (i * 19) % 128, (i % 3) + 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function getTexture(kind: MaterialKind): THREE.CanvasTexture {
  const cached = textureCache.get(kind);
  if (cached) return cached;
  const texture = makeTexture(kind);
  textureCache.set(kind, texture);
  return texture;
}

/** 棚拍环境:天空蓝顶 + 暖阳 + 草地反弹绿(IBL,无 CDN/HDR) */
function StudioEnv({ warmth }: { warmth: number }) {
  const sun = warmth > 0.55 ? "#ffe9c4" : warmth < 0.35 ? "#eef4f8" : "#fff4df";
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={1.5} position={[0, 7, 3]} scale={[16, 9, 1]} color={NAT.skyBlue} />
      <Lightformer form="rect" intensity={2.2} position={[5, 5, 5]} rotation={[0, -Math.PI / 4, 0]} scale={[6, 6, 1]} color={sun} />
      <Lightformer form="rect" intensity={0.7} position={[-7, 2, -5]} rotation={[0, Math.PI / 3, 0]} scale={[9, 5, 1]} color="#d8e6ea" />
      <Lightformer form="rect" intensity={0.45} position={[0, -3, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[16, 16, 1]} color={NAT.grass} />
      <Lightformer form="ring" intensity={1.1} position={[0, 9, 1]} scale={7} color="#ffffff" />
    </Environment>
  );
}

function SurfaceMaterial({
  name,
  tone = 0.5,
  transparent = false,
}: {
  name: string;
  tone?: number;
  transparent?: boolean;
}) {
  const kind = materialKind(name);
  const texture = useMemo(() => getTexture(kind), [kind]);
  const color =
    kind === "wood"
      ? NAT.wood
      : kind === "metal"
        ? NAT.metal
        : kind === "marble"
          ? NAT.marble
          : kind === "concrete"
            ? "#c4c3be"
            : kind === "granite"
              ? "#8b8985"
              : tone > 0.66
                ? C.mid
                : tone > 0.33
                  ? C.soft
                  : C.pale;
  const bumpScale = kind === "glass" ? 0.012 : kind === "metal" ? 0.018 : kind === "wood" ? 0.045 : 0.034;

  return (
    <meshPhysicalMaterial
      color={kind === "glass" ? NAT.glass : color}
      map={texture}
      bumpMap={texture}
      bumpScale={bumpScale}
      roughness={kind === "metal" ? 0.34 : kind === "glass" ? 0.08 : kind === "concrete" ? 0.96 : kind === "granite" ? 0.72 : 0.86}
      metalness={kind === "metal" ? 0.58 : 0}
      clearcoat={kind === "glass" ? 0.92 : kind === "metal" ? 0.35 : 0.12}
      clearcoatRoughness={kind === "glass" ? 0.08 : 0.34}
      ior={kind === "glass" ? 1.42 : 1.18}
      envMapIntensity={kind === "glass" ? 1.6 : kind === "metal" ? 1.1 : 0.4}
      transparent={transparent || kind === "glass"}
      opacity={kind === "glass" ? 0.42 : transparent ? 0.7 : 1}
    />
  );
}

function Column({ x, z, h, r = 0.06, material }: { x: number; z: number; h: number; r?: number; material: string }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[r, r, h, 14]} />
        <SurfaceMaterial name={material} tone={0.45} />
      </mesh>
      <mesh position={[0, h + 0.045, 0]} castShadow receiveShadow>
        <boxGeometry args={[r * 3.3, 0.09, r * 3.3]} />
        <SurfaceMaterial name={material} tone={0.55} />
      </mesh>
      <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
        <boxGeometry args={[r * 3.5, 0.09, r * 3.5]} />
        <SurfaceMaterial name={material} tone={0.55} />
      </mesh>
    </group>
  );
}

function Stair({ w, d, material }: { w: number; d: number; material: string }) {
  return (
    <group position={[0, 0.06, d / 2 + 0.28]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * 0.055, i * 0.18]} castShadow receiveShadow>
          <boxGeometry args={[w * (0.52 + i * 0.08), 0.07, 0.22]} />
          <SurfaceMaterial name={material} tone={0.28 + i * 0.16} />
        </mesh>
      ))}
    </group>
  );
}

function Rail({ w, d, material }: { w: number; d: number; material: string }) {
  const xs = [-w / 2 + 0.12, w / 2 - 0.12];
  return (
    <group position={[0, 0.36, 0]}>
      {xs.map((x) => (
        <mesh key={x} position={[x, 0, 0]} castShadow>
          <boxGeometry args={[0.045, 0.36, d]} />
          <SurfaceMaterial name={material} tone={0.68} />
        </mesh>
      ))}
      <mesh position={[0, 0.2, -d / 2 + 0.1]} castShadow>
        <boxGeometry args={[w, 0.05, 0.05]} />
        <SurfaceMaterial name={material} tone={0.68} />
      </mesh>
    </group>
  );
}

function Dome({ radius, material, baseY }: { radius: number; material: string; baseY: number }) {
  return (
    <mesh position={[0, baseY, 0]} castShadow receiveShadow>
      <sphereGeometry args={[radius, 26, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <SurfaceMaterial name={material} tone={0.35} />
    </mesh>
  );
}

/** 哥特尖顶 / 尖塔(scared) */
function Pinnacles({ w, d, h, material }: { w: number; d: number; h: number; material: string }) {
  const corners: [number, number][] = [
    [-w * 0.44, -d * 0.44],
    [w * 0.44, -d * 0.44],
    [-w * 0.44, d * 0.44],
    [w * 0.44, d * 0.44],
  ];
  return (
    <group position={[0, h + 0.28, 0]}>
      {corners.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.26, z]} castShadow>
          <coneGeometry args={[0.075, 0.6, 6]} />
          <SurfaceMaterial name={material} tone={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0.5, 0]} castShadow>
        <coneGeometry args={[0.16, 1.0, 6]} />
        <SurfaceMaterial name={material} tone={0.5} />
      </mesh>
    </group>
  );
}

/** Art Deco 阶梯退台 + 立向鳍(joyful) */
function DecoCrown({ w, d, h, material }: { w: number; d: number; h: number; material: string }) {
  return (
    <group position={[0, h + 0.28, 0]}>
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 0.7, 0.24, d * 0.7]} />
        <SurfaceMaterial name={material} tone={0.5} />
      </mesh>
      <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 0.44, 0.24, d * 0.44]} />
        <SurfaceMaterial name={material} tone={0.58} />
      </mesh>
      {[-0.3, 0, 0.3].map((x) => (
        <mesh key={x} position={[x * w, 0.5, 0]} castShadow>
          <boxGeometry args={[0.05, 0.4, d * 0.2]} />
          <SurfaceMaterial name={material} tone={0.66} />
        </mesh>
      ))}
    </group>
  );
}

function FacadeLines({ w, d, h }: { w: number; d: number; h: number }) {
  const verticals = [-0.34, -0.12, 0.12, 0.34];
  const bands = [0.28, 0.54, 0.8];
  return (
    <group position={[0, 0.14, 0]}>
      {verticals.map((x) => (
        <mesh key={`front-${x}`} position={[x * w, h * 0.5, -d / 2 - 0.028]} castShadow>
          <boxGeometry args={[0.028, h * 0.78, 0.035]} />
          <meshStandardMaterial color={C.mist} roughness={0.72} />
        </mesh>
      ))}
      {verticals.slice(1, 3).map((x) => (
        <mesh key={`side-${x}`} position={[w / 2 + 0.028, h * 0.5, x * d]} castShadow>
          <boxGeometry args={[0.035, h * 0.72, 0.026]} />
          <meshStandardMaterial color={C.mist} roughness={0.72} />
        </mesh>
      ))}
      {bands.map((y) => (
        <mesh key={`band-${y}`} position={[0, h * y, -d / 2 - 0.035]} castShadow>
          <boxGeometry args={[w * 0.92, 0.035, 0.04]} />
          <meshStandardMaterial color={C.pale} roughness={0.72} />
        </mesh>
      ))}
    </group>
  );
}

function RoofRibs({ w, d, y, material }: { w: number; d: number; y: number; material: string }) {
  return (
    <group position={[0, y, 0]}>
      {[-0.34, 0, 0.34].map((x) => (
        <mesh key={`rib-x-${x}`} position={[x * w, 0.06, 0]} castShadow>
          <boxGeometry args={[0.04, 0.09, d * 0.92]} />
          <SurfaceMaterial name={material} tone={0.72} />
        </mesh>
      ))}
      {[-0.28, 0.28].map((z) => (
        <mesh key={`rib-z-${z}`} position={[0, 0.08, z * d]} castShadow>
          <boxGeometry args={[w * 0.82, 0.07, 0.04]} />
          <SurfaceMaterial name={material} tone={0.68} />
        </mesh>
      ))}
    </group>
  );
}

function EdgeTrim({ w, d, h, material }: { w: number; d: number; h: number; material: string }) {
  const y = h + 0.42;
  return (
    <group position={[0, 0.18, 0]}>
      {[-1, 1].map((z) => (
        <mesh key={`trim-z-${z}`} position={[0, y, z * d * 0.43]} castShadow>
          <boxGeometry args={[w * 0.9, 0.035, 0.045]} />
          <SurfaceMaterial name={material} tone={0.72} />
        </mesh>
      ))}
      {[-1, 1].map((x) => (
        <mesh key={`trim-x-${x}`} position={[x * w * 0.43, y, 0]} castShadow>
          <boxGeometry args={[0.045, 0.035, d * 0.9]} />
          <SurfaceMaterial name={material} tone={0.72} />
        </mesh>
      ))}
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <mesh key={`post-${x}-${z}`} position={[x * w * 0.43, h * 0.5, z * d * 0.43]} castShadow>
            <boxGeometry args={[0.055, h * 0.82, 0.055]} />
            <SurfaceMaterial name={material} tone={0.66} />
          </mesh>
        ))
      )}
    </group>
  );
}

/** 齐平嵌入式开窗:深色窗套 + 暖光玻璃,均为 plane(零凸出、零穿模) */
function Apertures({ w, d, h }: { w: number; d: number; h: number }) {
  const cols = [-0.3, 0, 0.3];
  const rows = h > 1.4 ? [0.42, 0.68] : [0.56];
  const winW = Math.max(0.1, w * 0.12);
  const winH = Math.max(0.16, h * 0.16);
  const frontZ = -d / 2 - 0.008;
  const sideX = w / 2 + 0.008;
  return (
    <group>
      {rows.flatMap((row) =>
        cols.map((col) => (
          <group key={`front-ap-${row}-${col}`} position={[col * w, row * h + 0.16, frontZ]}>
            <mesh>
              <planeGeometry args={[winW * 1.4, winH * 1.32]} />
              <meshStandardMaterial color={C.deep} roughness={0.7} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, -0.004]}>
              <planeGeometry args={[winW, winH]} />
              <meshStandardMaterial color="#ffe9c2" emissive="#f2d79b" emissiveIntensity={0.95} roughness={0.35} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))
      )}
      {rows.map((row) => (
        <group key={`side-ap-${row}`} position={[sideX, row * h + 0.16, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <planeGeometry args={[winH * 1.3, winH * 1.32]} />
            <meshStandardMaterial color={C.deep} roughness={0.7} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0.004]}>
            <planeGeometry args={[winH * 0.92, winH]} />
            <meshStandardMaterial color="#ffe9c2" emissive="#f2d79b" emissiveIntensity={0.85} roughness={0.35} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function RoofPlanting({ w, d, h, index }: { w: number; d: number; h: number; index: number }) {
  const count = 3 + (index % 3);
  return (
    <group position={[0, h + 0.46, 0]}>
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 0.58, 0.04, d * 0.18]} />
        <meshStandardMaterial color={NAT.trunk} roughness={0.9} />
      </mesh>
      {Array.from({ length: count }, (_, i) => (
        <mesh
          key={i}
          position={[-w * 0.23 + (i / Math.max(1, count - 1)) * w * 0.46, 0.11 + (i % 2) * 0.025, (i % 2 === 0 ? -1 : 1) * d * 0.04]}
          castShadow
        >
          <sphereGeometry args={[0.075 + (i % 2) * 0.02, 8, 6]} />
          <meshStandardMaterial color={i % 2 ? NAT.foliage : NAT.foliageDark} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Arch({ w, h, d, material }: { w: number; h: number; d: number; material: string }) {
  return (
    <group>
      <Column x={-w * 0.36} z={0} h={h * 0.82} r={Math.max(0.05, w * 0.045)} material={material} />
      <Column x={w * 0.36} z={0} h={h * 0.82} r={Math.max(0.05, w * 0.045)} material={material} />
      <mesh position={[0, h * 0.88, 0]} castShadow receiveShadow>
        <torusGeometry args={[w * 0.36, Math.max(0.04, w * 0.045), 8, 20, Math.PI]} />
        <SurfaceMaterial name={material} tone={0.62} />
      </mesh>
      <mesh position={[0, h * 0.78, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h * 0.12, d * 0.24]} />
        <SurfaceMaterial name={material} tone={0.58} />
      </mesh>
    </group>
  );
}

/** 古典山花 / 三角楣(confident):横向檐部 + 两根斜椽构成三角轮廓 */
function Pediment({ w, depth, y, material }: { w: number; depth: number; y: number; material: string }) {
  const half = w * 0.55;
  const rise = 0.36;
  const rafter = Math.hypot(half, rise);
  const angle = Math.atan2(rise, half);
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, -0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 1.12, 0.1, depth * 1.05]} />
        <SurfaceMaterial name={material} tone={0.6} />
      </mesh>
      {[-1, 1].map((sgn) => (
        <mesh key={sgn} position={[sgn * half * 0.5, rise * 0.5 + 0.04, 0]} rotation={[0, 0, -sgn * angle]} castShadow>
          <boxGeometry args={[rafter, 0.08, depth]} />
          <SurfaceMaterial name={material} tone={0.66} />
        </mesh>
      ))}
    </group>
  );
}

function Block({ b, index, material, style }: { b: MassingBlock; index: number; material: string; style: string }) {
  const st = style.toLowerCase();
  const isByz = st.includes("byzantine");
  const isClassical = st.includes("classical");
  const isGothic = st.includes("gothic");
  const isDeco = st.includes("deco");
  const isDeconstruct = st.includes("deconstruct");
  const isHeavy = st.includes("heavy") || st.includes("confin");

  const wantsDome = isByz && index % 2 === 0;
  const wantsColumns = isClassical || index % 4 === 1;
  const wantsRail = index % 3 === 2;
  // 解构主义:整体倾斜、碰撞;沉重:压低
  const tiltX = isDeconstruct ? (index % 2 ? 0.09 : -0.06) : 0;
  const tiltZ = isDeconstruct ? (index % 3 ? -0.07 : 0.05) : 0;
  const extraRot = isDeconstruct ? 0.24 : 0;

  if (b.kind === "spire") {
    return (
      <group position={[b.x, 0, b.z]} rotation={[0, b.rot, 0]}>
        <mesh position={[0, b.h * 0.5, 0]} castShadow receiveShadow>
          <coneGeometry args={[Math.min(b.w, b.d) * 0.48, b.h, 7]} />
          <SurfaceMaterial name={material} tone={b.tone} />
        </mesh>
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[b.w * 0.95, 0.24, b.d * 0.95]} />
          <SurfaceMaterial name={material} tone={0.42} />
        </mesh>
      </group>
    );
  }

  if (b.kind === "arch") {
    return (
      <group position={[b.x, 0, b.z]} rotation={[0, b.rot, 0]}>
        <Arch w={b.w} h={b.h} d={b.d} material={material} />
        <Stair w={b.w} d={b.d} material={material} />
      </group>
    );
  }

  const massH = isHeavy ? b.h * 0.72 : b.h;

  return (
    <group position={[b.x, 0, b.z]} rotation={[tiltX, b.rot + extraRot, tiltZ]}>
      <RoundedBox args={[b.w * 1.18, 0.14, b.d * 1.18]} radius={0.03} smoothness={3} position={[0, 0.07, 0]} castShadow receiveShadow>
        <SurfaceMaterial name="Granite" tone={0.34} />
      </RoundedBox>
      <RoundedBox args={[b.w, massH, b.d]} radius={0.05} smoothness={4} position={[0, massH * 0.5 + 0.14, 0]} castShadow receiveShadow>
        <SurfaceMaterial name={material} tone={isHeavy ? 0.85 : b.tone} transparent={b.kind === "ruin"} />
      </RoundedBox>
      {/* 基座线脚(石材,与楼身材质形成对比) */}
      <RoundedBox args={[b.w * 1.08, 0.09, b.d * 1.08]} radius={0.02} smoothness={2} position={[0, 0.22, 0]} castShadow receiveShadow>
        <SurfaceMaterial name="Granite" tone={0.42} />
      </RoundedBox>
      <FacadeLines w={b.w} d={b.d} h={massH} />
      <Apertures w={b.w} d={b.d} h={massH} />
      {/* 外挑檐口 */}
      <RoundedBox args={[b.w * 1.13, 0.13, b.d * 1.13]} radius={0.03} smoothness={2} position={[0, massH + 0.14, 0]} castShadow receiveShadow>
        <SurfaceMaterial name={material} tone={0.58} />
      </RoundedBox>
      {/* 屋面 */}
      <mesh position={[0, massH + 0.26, 0]} castShadow receiveShadow>
        <boxGeometry args={[b.w * 0.86, 0.1, b.d * 0.86]} />
        <SurfaceMaterial name={material} tone={0.5} />
      </mesh>
      {/* 高楼退台顶(收分,破方块) */}
      {massH > 1.6 && !isGothic && !isDeco && (
        <RoundedBox
          args={[b.w * 0.58, massH * 0.3, b.d * 0.58]}
          radius={0.04}
          smoothness={3}
          position={[0, massH + 0.31 + massH * 0.15, 0]}
          castShadow
          receiveShadow
        >
          <SurfaceMaterial name={material} tone={0.55} />
        </RoundedBox>
      )}
      <RoofRibs w={b.w * 0.82} d={b.d * 0.82} y={massH + 0.3} material={material} />
      <EdgeTrim w={b.w} d={b.d} h={massH} material={material} />
      {wantsDome && <Dome radius={Math.min(b.w, b.d) * 0.34} baseY={massH + 0.3} material={material} />}
      {isGothic && <Pinnacles w={b.w} d={b.d} h={massH} material={material} />}
      {isDeco && <DecoCrown w={b.w} d={b.d} h={massH} material={material} />}
      {isClassical && <Pediment w={b.w} depth={b.d * 0.94} y={massH + 0.34} material={material} />}
      {isHeavy && (
        <mesh position={[0, massH + 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[b.w * 1.38, 0.22, b.d * 1.38]} />
          <SurfaceMaterial name={material} tone={0.92} />
        </mesh>
      )}
      {(index + Math.round(b.tone * 10)) % 2 === 0 && !isGothic && !isDeco && !isHeavy && (
        <RoofPlanting w={b.w} d={b.d} h={massH} index={index} />
      )}
      {wantsColumns && (
        <group position={[0, 0.18, -b.d / 2 - 0.08]}>
          {[-0.36, -0.12, 0.12, 0.36].map((x) => (
            <Column key={x} x={x * b.w} z={0} h={Math.max(0.55, massH * 0.74)} material={material} />
          ))}
        </group>
      )}
      {wantsRail && <Rail w={b.w * 1.08} d={b.d * 1.08} material={material} />}
      <Stair w={b.w} d={b.d} material={material} />
    </group>
  );
}

function Plant({ v }: { v: VegetationInstance }) {
  const h = v.scale * (v.kind === "pine" ? 1.45 : v.kind === "canna" ? 1.05 : 0.72);
  const Shadow = () => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow>
      <circleGeometry args={[v.kind === "pine" ? 0.38 : 0.3, 18]} />
      <meshBasicMaterial color="#2e3320" transparent opacity={0.18} depthWrite={false} />
    </mesh>
  );

  if (v.kind === "pine") {
    return (
      <group position={[v.x, 0, v.z]} scale={v.scale}>
        <Shadow />
        <mesh position={[0, h * 0.28, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.05, h * 0.56, 6]} />
          <meshStandardMaterial color={NAT.trunk} roughness={1} />
        </mesh>
        {[0.55, 0.82, 1.08].map((y, i) => (
          <mesh key={y} position={[0, h * y, 0]} castShadow>
            <coneGeometry args={[0.42 - i * 0.08, h * 0.48, 8]} />
            <meshStandardMaterial color={i === 0 ? NAT.foliageDark : i === 1 ? NAT.foliage : NAT.foliageLight} roughness={1} flatShading />
          </mesh>
        ))}
      </group>
    );
  }

  if (v.kind === "canna") {
    return (
      <group position={[v.x, 0, v.z]} scale={v.scale}>
        <Shadow />
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[Math.sin(i) * 0.08, 0.38, Math.cos(i) * 0.08]} rotation={[0.4, i * 0.8, -0.35 + i * 0.12]} castShadow>
            <coneGeometry args={[0.08, 0.85, 5]} />
            <meshStandardMaterial color={i % 2 ? NAT.foliage : NAT.foliageLight} roughness={1} flatShading />
          </mesh>
        ))}
        {[0, 1, 2].map((i) => (
          <mesh key={`f${i}`} position={[Math.sin(i * 2) * 0.05, 0.8 + i * 0.05, Math.cos(i * 2) * 0.05]} castShadow>
            <coneGeometry args={[0.05, 0.16, 5]} />
            <meshStandardMaterial color={NAT.cannaFlower} roughness={0.8} />
          </mesh>
        ))}
      </group>
    );
  }

  if (v.kind === "blossom") {
    return (
      <group position={[v.x, 0, v.z]} scale={v.scale}>
        <Shadow />
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.045, 0.64, 6]} />
          <meshStandardMaterial color={NAT.trunk} roughness={1} />
        </mesh>
        {Array.from({ length: 15 }, (_, i) => (
          <mesh key={i} position={[Math.sin(i * 1.7) * 0.38, 0.58 + (i % 4) * 0.08, Math.cos(i * 1.2) * 0.34]} castShadow>
            <sphereGeometry args={[0.13 + (i % 3) * 0.025, 8, 6]} />
            <meshStandardMaterial color={i % 3 === 0 ? NAT.blossomLight : NAT.blossom} roughness={1} />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group position={[v.x, 0, v.z]} scale={v.scale}>
      <Shadow />
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[Math.sin(i) * 0.22, 0.28 + (i % 2) * 0.07, Math.cos(i) * 0.2]} castShadow>
          <sphereGeometry args={[0.23, 8, 6]} />
          <meshStandardMaterial color={i % 2 ? NAT.foliage : NAT.foliageLight} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function seededUnit(seed: number, i: number) {
  const n = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function ExtraPlanting({ space, quality }: { space: ComposedSpace; quality: SceneQuality }) {
  const plants = useMemo<VegetationInstance[]>(() => {
    const base = quality === "full" ? 10 : 6;
    const spread = quality === "full" ? 24 : 10;
    const count = Math.round(base + space.params.vegetationDensity * spread);
    return Array.from({ length: count }, (_, i) => {
      const side = seededUnit(space.seed, i * 5) > 0.5 ? 1 : -1;
      const x = -5.3 + seededUnit(space.seed, i * 5 + 1) * 10.6;
      const z = side * (2.8 + seededUnit(space.seed, i * 5 + 2) * 1.1);
      const kind = space.params.vegetationKinds[i % space.params.vegetationKinds.length] ?? "shrub";
      return { x, z, scale: 0.34 + seededUnit(space.seed, i * 5 + 3) * 0.42, kind };
    });
  }, [quality, space.params.vegetationDensity, space.params.vegetationKinds, space.seed]);

  return (
    <>
      {plants.map((v, i) => (
        <Plant key={`extra-${i}`} v={v} />
      ))}
    </>
  );
}

function Person({ x, z, scale, tone }: { x: number; z: number; scale: number; tone: number }) {
  const cloth = CLOTHES[Math.floor(tone * CLOTHES.length) % CLOTHES.length] ?? "#7a5088";
  return (
    <group position={[x, 0.02, z]} scale={scale}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.032, 0.32, 7]} />
        <meshStandardMaterial color={cloth} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.39, 0]} castShadow>
        <sphereGeometry args={[0.055, 10, 8]} />
        <meshStandardMaterial color={SKIN} roughness={0.85} />
      </mesh>
      <mesh position={[0.055, 0.16, 0]} rotation={[0, 0, 0.35]} castShadow>
        <boxGeometry args={[0.018, 0.22, 0.018]} />
        <meshStandardMaterial color={cloth} roughness={0.85} />
      </mesh>
      <mesh position={[-0.055, 0.16, 0]} rotation={[0, 0, -0.35]} castShadow>
        <boxGeometry args={[0.018, 0.22, 0.018]} />
        <meshStandardMaterial color={cloth} roughness={0.85} />
      </mesh>
    </group>
  );
}

function PeopleField({ space, quality }: { space: ComposedSpace; quality: SceneQuality }) {
  const people = useMemo(() => {
    const base = quality === "full" ? 16 : 8;
    const spread = quality === "full" ? 18 : 8;
    const count = Math.round(base + space.params.energy * spread);
    return Array.from({ length: count }, (_, i) => {
      const onPath = space.path[i % Math.max(1, space.path.length)];
      const spread = seededUnit(space.seed, i * 7 + 1) - 0.5;
      return {
        x: (onPath?.x ?? 0) + spread * 0.7,
        z: (onPath?.z ?? 0) + (seededUnit(space.seed, i * 7 + 2) - 0.5) * 0.55,
        scale: 0.58 + seededUnit(space.seed, i * 7 + 3) * 0.32,
        tone: seededUnit(space.seed, i * 7 + 4),
      };
    });
  }, [quality, space.params.energy, space.path, space.seed]);

  return (
    <>
      {people.map((p, i) => (
        <Person key={`person-${i}`} {...p} />
      ))}
    </>
  );
}

function PathLine({ path }: { path: { x: number; z: number }[] }) {
  const points = useMemo<[number, number, number][]>(() => path.map((p) => [p.x, 0.08, p.z]), [path]);
  if (points.length < 2) return null;
  return <Line points={points} color="#e6d9bd" lineWidth={3} />;
}

function GroundDetails({ space, quality }: { space: ComposedSpace; quality: SceneQuality }) {
  const stones = useMemo(() => {
    const count = quality === "full" ? 42 : 20;
    return Array.from({ length: count }, (_, i) => ({
      x: -5.6 + seededUnit(space.seed, i * 9 + 1) * 11.2,
      z: -3.6 + seededUnit(space.seed, i * 9 + 2) * 7.2,
      s: 0.035 + seededUnit(space.seed, i * 9 + 3) * 0.08,
      r: seededUnit(space.seed, i * 9 + 4) * Math.PI,
      tone: seededUnit(space.seed, i * 9 + 5),
    }));
  }, [quality, space.seed]);

  const pathPavers = useMemo(() => {
    return space.path.flatMap((p, i) => [
      { x: p.x, z: p.z, r: i * 0.37 },
      { x: p.x + 0.24, z: p.z + 0.18, r: i * 0.21 },
    ]);
  }, [space.path]);

  const pools = useMemo(() => {
    const count = quality === "full" && space.params.pleasantness > 0.55 ? 2 : 1;
    return Array.from({ length: count }, (_, i) => ({
      x: -3.4 + seededUnit(space.seed, 100 + i) * 6.8,
      z: -2.4 + seededUnit(space.seed, 120 + i) * 4.8,
      w: 0.78 + seededUnit(space.seed, 140 + i) * 0.65,
      d: 0.22 + seededUnit(space.seed, 160 + i) * 0.32,
      r: seededUnit(space.seed, 180 + i) * Math.PI,
    }));
  }, [quality, space.params.pleasantness, space.seed]);

  const tufts = useMemo(() => {
    const base = quality === "full" ? 18 : 10;
    const spread = quality === "full" ? 28 : 12;
    const count = Math.round(base + space.params.vegetationDensity * spread);
    return Array.from({ length: count }, (_, i) => {
      const pathPoint = space.path[i % Math.max(1, space.path.length)] ?? { x: 0, z: 0 };
      const edge = seededUnit(space.seed, 220 + i) > 0.55;
      return {
        x: edge ? -5.4 + seededUnit(space.seed, 230 + i) * 10.8 : pathPoint.x + (seededUnit(space.seed, 240 + i) - 0.5) * 0.9,
        z: edge ? (seededUnit(space.seed, 250 + i) > 0.5 ? 3.15 : -3.15) : pathPoint.z + (seededUnit(space.seed, 260 + i) - 0.5) * 0.85,
        r: seededUnit(space.seed, 270 + i) * Math.PI,
        s: 0.16 + seededUnit(space.seed, 280 + i) * 0.22,
      };
    });
  }, [quality, space.params.vegetationDensity, space.path, space.seed]);

  return (
    <group>
      <group position={[0, 0.11, 0]}>
        {[
          { key: "north", x: 0, z: -4.18, w: 12.4, d: 0.08 },
          { key: "south", x: 0, z: 4.18, w: 12.4, d: 0.08 },
          { key: "west", x: -6.18, z: 0, w: 0.08, d: 8.2 },
          { key: "east", x: 6.18, z: 0, w: 0.08, d: 8.2 },
        ].map((edge) => (
          <mesh key={edge.key} position={[edge.x, 0, edge.z]} castShadow receiveShadow>
            <boxGeometry args={[edge.w, 0.22, edge.d]} />
            <meshStandardMaterial color={C.pale} roughness={0.92} />
          </mesh>
        ))}
      </group>
      {pools.map((pool, i) => (
        <mesh key={`pool-${i}`} position={[pool.x, 0.04, pool.z]} rotation={[-Math.PI / 2, 0, pool.r]} scale={[pool.w, pool.d, 1]}>
          <planeGeometry args={[2, 2]} />
          {quality === "full" ? (
            <MeshReflectorMaterial
              resolution={512}
              blur={[300, 90]}
              mixBlur={1}
              mixStrength={4}
              roughness={0.35}
              depthScale={0.4}
              minDepthThreshold={0.4}
              color={NAT.waterDeep}
              metalness={0.1}
              mirror={0.55}
            />
          ) : (
            <meshStandardMaterial color={NAT.waterDeep} roughness={0.32} metalness={0.05} />
          )}
        </mesh>
      ))}
      {pathPavers.map((p, i) => (
        <mesh key={`paver-${i}`} position={[p.x, 0.075, p.z]} rotation={[0, p.r, 0]} receiveShadow>
          <boxGeometry args={[0.34, 0.025, 0.16]} />
          <meshStandardMaterial color={i % 2 ? C.mist : C.pale} roughness={0.94} />
        </mesh>
      ))}
      {stones.map((stone, i) => (
        <mesh key={`stone-${i}`} position={[stone.x, 0.075, stone.z]} rotation={[0, stone.r, 0]} receiveShadow>
          <boxGeometry args={[stone.s * 1.8, 0.025, stone.s]} />
          <meshStandardMaterial color={stone.tone > 0.5 ? C.soft : C.pale} roughness={1} />
        </mesh>
      ))}
      {tufts.map((tuft, i) => (
        <group key={`tuft-${i}`} position={[tuft.x, 0.08, tuft.z]} rotation={[0, tuft.r, 0]} scale={tuft.s}>
          {[-0.32, 0, 0.32].map((tilt, leaf) => (
            <mesh key={leaf} position={[leaf * 0.18 - 0.18, 0.2, 0]} rotation={[0.35, leaf * 0.65, tilt]} castShadow>
              <coneGeometry args={[0.09, 0.52, 5]} />
              <meshStandardMaterial color={leaf % 2 ? NAT.foliageDark : NAT.foliage} roughness={1} flatShading />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function CloudClump({ position, scale, opacity }: { position: [number, number, number]; scale: number; opacity: number }) {
  const puffs: [number, number, number, number][] = [
    [0, 0, 0, 1], [1.1, -0.2, 0.2, 0.8], [-1.0, -0.1, -0.2, 0.75],
    [0.45, 0.3, -0.4, 0.62], [-0.55, 0.25, 0.4, 0.56],
  ];
  return (
    <group position={position} scale={scale}>
      {puffs.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]}>
          <icosahedronGeometry args={[p[3], 1]} />
          <meshStandardMaterial color={C.white} roughness={1} flatShading transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}

function SkyClouds({ mode }: { mode: WeatherMode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.position.x = Math.sin(state.clock.elapsedTime * 0.05) * 1.3;
  });
  if (mode === "clear") return null;
  const op = mode === "storm" ? 0.95 : mode === "cloudy" ? 0.8 : 0.88;
  return (
    <group ref={ref}>
      <CloudClump position={[-4, 7.6, -2]} scale={1.1} opacity={op} />
      <CloudClump position={[3, 8.2, 1]} scale={1.45} opacity={op} />
      <CloudClump position={[0.5, 7.1, 3.4]} scale={0.95} opacity={op * 0.9} />
      {(mode === "storm" || mode === "snow") && <CloudClump position={[-1.2, 6.6, -3.6]} scale={1.25} opacity={op} />}
    </group>
  );
}

function Precipitation({ mode }: { mode: WeatherMode }) {
  const isRain = mode === "rain" || mode === "storm";
  const isSnow = mode === "snow";
  const active = isRain || isSnow;
  const count = mode === "storm" ? 620 : isRain ? 380 : isSnow ? 260 : 0;
  const speed = mode === "storm" ? 17 : isRain ? 12 : 2.3;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(Math.max(count, 1) * 3);
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = Math.random() * 14 + 1;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 11;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const pts = ref.current;
    if (!pts || !active) return;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i += 1) {
      arr[i * 3 + 1] -= speed * delta;
      if (isSnow) arr[i * 3] += Math.sin(t * 1.2 + i) * 0.006;
      if (arr[i * 3 + 1] < 0) {
        arr[i * 3 + 1] = 14 + Math.random() * 2;
        arr[i * 3] = (Math.random() - 0.5) * 16;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 11;
      }
    }
    pts.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;
  return (
    <points ref={ref} key={mode}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={isSnow ? 0.17 : 0.09} color={isSnow ? C.white : "#aac4d2"} transparent opacity={isSnow ? 0.95 : 0.6} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Lightning() {
  const ref = useRef<THREE.PointLight>(null);
  const tick = useRef(0);
  const next = useRef(2 + Math.random() * 4);
  const flash = useRef(0);
  useFrame((_, delta) => {
    tick.current += delta;
    if (flash.current > 0) flash.current -= delta * 4.5;
    if (tick.current > next.current) {
      flash.current = 1;
      tick.current = 0;
      next.current = 3 + Math.random() * 5;
    }
    if (ref.current) ref.current.intensity = Math.max(0, flash.current) * 7;
  });
  return <pointLight ref={ref} position={[0, 12, 1]} color={C.white} intensity={0} distance={44} />;
}

export const ENV: Record<WeatherMode, { bg: string; near: number; far: number }> = {
  clear: { bg: "#c3ddf0", near: 20, far: 52 },
  cloudy: { bg: "#c4ccd2", near: 16, far: 44 },
  rain: { bg: "#a7b3bb", near: 13, far: 38 },
  storm: { bg: "#7c858c", near: 11, far: 33 },
  snow: { bg: "#dfe6ea", near: 14, far: 40 },
};

/* ============================================================
   情绪场景配方(SceneRecipe)—— 心情 → 舞台叙事的逻辑链路
   每种情绪一整套:地面基色 / 太阳角度(低阳=长影) / 光强 /
   雾浓度与天色 / 专属戏剧元素。视觉强烈,但每一项都有心理学逻辑。
   ============================================================ */

interface SceneRecipe {
  /** 地面基色(生机 ↔ 枯槁) */
  grass: string;
  /** 太阳/主光位置:高阳=明朗,低阳=长影与剪影 */
  sun: [number, number, number];
  /** 主光强度系数 */
  keyBoost: number;
  /** 环境光系数(消极情绪压暗出戏剧性) */
  ambientBoost: number;
}

const RECIPE: Record<EmotionKey, SceneRecipe> = {
  confident: { grass: "#7fa055", sun: [7, 9, 3], keyBoost: 1.05, ambientBoost: 1.0 },
  calm: { grass: "#7c9a54", sun: [-4, 6, 5], keyBoost: 0.9, ambientBoost: 1.05 },
  joyful: { grass: "#82ab52", sun: [5, 12, 5], keyBoost: 1.15, ambientBoost: 1.12 },
  scared: { grass: "#57604f", sun: [3, 4, -7], keyBoost: 1.0, ambientBoost: 0.6 }, // 逆光:塔群成剪影
  sad: { grass: "#6f6f5e", sun: [-8, 2.6, -2], keyBoost: 0.85, ambientBoost: 0.64 }, // 低垂夕光:长影
  mad: { grass: "#6e6a58", sun: [8, 5, -3], keyBoost: 1.25, ambientBoost: 0.7 }, // 侧向硬光
};

/** 天穹/雾按情绪修正:消极→雾浓且暗(世界收窄),积极→通透(世界开阔) */
export function envFor(weather: WeatherMode, emotion: EmotionKey): { bg: string; near: number; far: number } {
  const base = ENV[weather];
  const f =
    emotion === "scared" ? 0.62 : emotion === "sad" ? 0.72 : emotion === "mad" ? 0.85 : emotion === "joyful" ? 1.3 : emotion === "confident" ? 1.15 : 1;
  const darken = emotion === "scared" ? 0.3 : emotion === "sad" ? 0.24 : emotion === "mad" ? 0.14 : 0;
  const bg = darken > 0 ? `#${new THREE.Color(base.bg).lerp(new THREE.Color("#343b41"), darken).getHexString()}` : base.bg;
  return { bg, near: base.near * f, far: base.far * f };
}

/* ---------- 每情绪的专属戏剧元素 ---------- */

/** sad:围合空场里的一棵光秃孤树(空旷中的孤独) */
function LoneTree({ x, z }: { x: number; z: number }) {
  const branches: { pos: [number, number, number]; rot: [number, number, number]; len: number }[] = [
    { pos: [0.18, 1.62, 0], rot: [0, 0, -0.62], len: 1.15 },
    { pos: [-0.2, 1.4, 0.06], rot: [0.12, 0, 0.7], len: 0.95 },
    { pos: [0.08, 1.98, -0.1], rot: [0.55, 0, -0.3], len: 0.7 },
    { pos: [-0.08, 1.86, 0.12], rot: [-0.5, 0, 0.28], len: 0.6 },
  ];
  return (
    <group position={[x, 0, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 0]} receiveShadow>
        <circleGeometry args={[0.42, 18]} />
        <meshBasicMaterial color="#2e2b24" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.15, 2.0, 8]} />
        <meshStandardMaterial color="#4a4038" roughness={1} />
      </mesh>
      {branches.map((b, i) => (
        <mesh key={i} position={b.pos} rotation={b.rot} castShadow>
          <cylinderGeometry args={[0.018, 0.045, b.len, 6]} />
          <meshStandardMaterial color="#4a4038" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/** scared:一束从高空缓慢扫动的冷追光(被审视感) */
function SearchBeam() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.22) * 0.9;
  });
  return (
    <group ref={ref}>
      <group position={[0, 8.4, 0]} rotation={[0.42, 0, 0]}>
        <mesh position={[0, -4.3, 0]}>
          <coneGeometry args={[2.0, 8.6, 24, 1, true]} />
          <meshBasicMaterial
            color="#dfe9f2"
            transparent
            opacity={0.11}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <pointLight position={[0, -8.0, 0]} intensity={2.6} distance={7} color="#e8f1f8" />
      </group>
    </group>
  );
}

/** mad:悬浮旋转的碎块 + 内热微光(悬而未决的张力) */
function FloatingShards({ seed }: { seed: number }) {
  const ref = useRef<THREE.Group>(null);
  const shards = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        x: -4 + seededUnit(seed, 40 + i) * 8,
        y: 2.2 + seededUnit(seed, 60 + i) * 2.4,
        z: -2.6 + seededUnit(seed, 80 + i) * 5.2,
        s: 0.16 + seededUnit(seed, 100 + i) * 0.3,
        r: seededUnit(seed, 120 + i) * Math.PI * 2,
        spin: 0.2 + seededUnit(seed, 140 + i) * 0.5,
      })),
    [seed]
  );
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((c, i) => {
      const sh = shards[i];
      if (!sh) return;
      c.position.y = sh.y + Math.sin(t * 0.6 + i) * 0.22;
      c.rotation.y = sh.r + t * sh.spin * 0.4;
      c.rotation.x = sh.r * 0.6 + t * sh.spin * 0.25;
    });
  });
  return (
    <group ref={ref}>
      {shards.map((sh, i) => (
        <mesh key={i} position={[sh.x, sh.y, sh.z]} castShadow>
          <tetrahedronGeometry args={[sh.s, 0]} />
          <meshStandardMaterial color="#7d838b" roughness={0.5} metalness={0.55} emissive="#c8502e" emissiveIntensity={0.22} />
        </mesh>
      ))}
    </group>
  );
}

/** joyful:飘落的花瓣(空气里都是轻的) */
function PetalFall({ count = 160 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 13;
      arr[i * 3 + 1] = Math.random() * 7 + 0.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);
  useFrame((state, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= delta * (0.35 + (i % 5) * 0.06);
      arr[i * 3] += Math.sin(t * 0.9 + i) * delta * 0.5;
      if (arr[i * 3 + 1] < 0.05) {
        arr[i * 3 + 1] = 6.5 + Math.random();
        arr[i * 3] = (Math.random() - 0.5) * 13;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
      }
    }
    pts.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.14} color={NAT.blossom} transparent opacity={0.9} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/** calm:贴地缓漂的薄雾(呼吸放慢) */
function GroundMist() {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (a.current) a.current.position.x = Math.sin(t * 0.05) * 1.4;
    if (b.current) b.current.position.x = Math.cos(t * 0.04) * 1.8;
  });
  return (
    <group>
      <mesh ref={a} position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 9]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.07} depthWrite={false} />
      </mesh>
      <mesh ref={b} position={[0.8, 0.9, -0.6]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <planeGeometry args={[12, 7]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** confident:仪式性光轴——发光步道 + 两列灯柱,把视线导向方尖碑 */
function LightAxis({ material }: { material: string }) {
  const xs = [-4.4, -2.9, 2.9, 4.4];
  return (
    <group>
      {[-1, 1].map((sgn) => (
        <mesh key={sgn} position={[sgn * 4.0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.8, 0.5]} />
          <meshStandardMaterial color="#efe8d6" emissive="#f4e9c8" emissiveIntensity={0.3} roughness={0.6} />
        </mesh>
      ))}
      {xs.flatMap((x) =>
        [-1.15, 1.15].map((z) => (
          <group key={`${x}-${z}`} position={[x, 0, z]}>
            <mesh position={[0, 0.8, 0]} castShadow>
              <cylinderGeometry args={[0.035, 0.05, 1.6, 8]} />
              <SurfaceMaterial name={material} tone={0.5} />
            </mesh>
            <mesh position={[0, 1.66, 0]}>
              <sphereGeometry args={[0.09, 10, 8]} />
              <meshStandardMaterial color="#ffe9c2" emissive="#f2d79b" emissiveIntensity={1.4} />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
}

/** 情绪地面细节:sad 裂缝+积水 / joyful 花田 / mad 焦土斑 */
function EmotionGround({ emotion, seed }: { emotion: EmotionKey; seed: number }) {
  const flowers = useMemo(() => {
    if (emotion !== "joyful") return [];
    const colors = ["#e05a7a", "#e8b23e", "#d24b2e", "#f1bcd0", "#b06ac9"];
    return Array.from({ length: 84 }, (_, i) => {
      const edge = seededUnit(seed, 300 + i) > 0.4;
      return {
        x: -5.8 + seededUnit(seed, 320 + i) * 11.6,
        z: edge ? (seededUnit(seed, 340 + i) > 0.5 ? 1 : -1) * (2.2 + seededUnit(seed, 360 + i) * 1.6) : (seededUnit(seed, 340 + i) - 0.5) * 6.4,
        s: 0.035 + seededUnit(seed, 380 + i) * 0.045,
        c: colors[i % colors.length] ?? "#e05a7a",
      };
    });
  }, [emotion, seed]);

  const cracks = useMemo(() => {
    if (emotion !== "sad") return [];
    return Array.from({ length: 10 }, (_, i) => ({
      x: -3.5 + seededUnit(seed, 400 + i) * 7,
      z: -2.4 + seededUnit(seed, 420 + i) * 4.8,
      len: 0.5 + seededUnit(seed, 440 + i) * 0.9,
      r: seededUnit(seed, 460 + i) * Math.PI,
    }));
  }, [emotion, seed]);

  const scorch = useMemo(() => {
    if (emotion !== "mad") return [];
    return Array.from({ length: 4 }, (_, i) => ({
      x: -3.6 + seededUnit(seed, 500 + i) * 7.2,
      z: -2.2 + seededUnit(seed, 520 + i) * 4.4,
      rad: 0.5 + seededUnit(seed, 540 + i) * 0.7,
    }));
  }, [emotion, seed]);

  if (emotion === "sad") {
    return (
      <group>
        {cracks.map((c, i) => (
          <mesh key={`crack-${i}`} position={[c.x, 0.058, c.z]} rotation={[0, c.r, 0]}>
            <boxGeometry args={[c.len, 0.012, 0.035]} />
            <meshStandardMaterial color="#3c3a32" roughness={1} />
          </mesh>
        ))}
        {[
          { x: -1.6, z: 0.2, w: 1.15, d: 0.5, r: 0.5 },
          { x: 0.9, z: -0.9, w: 0.85, d: 0.4, r: 2.2 },
        ].map((pd, i) => (
          <mesh key={`puddle-${i}`} position={[pd.x, 0.045, pd.z]} rotation={[-Math.PI / 2, 0, pd.r]} scale={[pd.w, pd.d, 1]}>
            <circleGeometry args={[1, 28]} />
            <MeshReflectorMaterial
              resolution={512}
              blur={[260, 80]}
              mixBlur={1}
              mixStrength={5}
              roughness={0.25}
              depthScale={0.35}
              minDepthThreshold={0.4}
              color="#5a6a70"
              metalness={0.05}
              mirror={0.6}
            />
          </mesh>
        ))}
      </group>
    );
  }

  if (emotion === "joyful") {
    return (
      <group>
        {flowers.map((f, i) => (
          <group key={i} position={[f.x, 0.05, f.z]}>
            <mesh position={[0, 0.05, 0]} castShadow>
              <cylinderGeometry args={[0.008, 0.012, 0.1, 5]} />
              <meshStandardMaterial color={NAT.foliageDark} roughness={1} />
            </mesh>
            <mesh position={[0, 0.12, 0]} castShadow>
              <sphereGeometry args={[f.s, 7, 6]} />
              <meshStandardMaterial color={f.c} roughness={0.85} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  if (emotion === "mad") {
    return (
      <group>
        {scorch.map((sc, i) => (
          <mesh key={i} position={[sc.x, 0.052, sc.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[sc.rad, 22]} />
            <meshBasicMaterial color="#2f2b26" transparent opacity={0.42} depthWrite={false} />
          </mesh>
        ))}
      </group>
    );
  }

  return null;
}

/** 广场铺装:圆形石铺 + 同心分隔线 */
function PlazaGround({ radius, material }: { radius: number; material: string }) {
  return (
    <group position={[0, 0.055, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[radius, 48]} />
        <SurfaceMaterial name={material} tone={0.3} />
      </mesh>
      {[0.45, 0.72, 0.95].map((r) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
          <ringGeometry args={[radius * r - 0.02, radius * r, 56]} />
          <meshStandardMaterial color={C.mid} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** 方尖碑(confident/joyful 广场中心) */
function Obelisk({ material }: { material: string }) {
  return (
    <group>
      <RoundedBox args={[1.1, 0.24, 1.1]} radius={0.03} smoothness={2} position={[0, 0.12, 0]} castShadow receiveShadow>
        <SurfaceMaterial name={material} tone={0.4} />
      </RoundedBox>
      <RoundedBox args={[0.7, 0.2, 0.7]} radius={0.03} smoothness={2} position={[0, 0.34, 0]} castShadow receiveShadow>
        <SurfaceMaterial name={material} tone={0.48} />
      </RoundedBox>
      <group rotation={[0, Math.PI / 4, 0]}>
        <mesh position={[0, 1.55, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.2, 2.3, 4]} />
          <SurfaceMaterial name={material} tone={0.52} />
        </mesh>
        <mesh position={[0, 2.85, 0]} castShadow>
          <coneGeometry args={[0.15, 0.42, 4]} />
          <SurfaceMaterial name={material} tone={0.5} />
        </mesh>
      </group>
    </group>
  );
}

/** 穹顶亭(calm 庭院中心) */
function Pavilion({ material }: { material: string }) {
  return (
    <group>
      <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.42, 0.18, 32]} />
        <SurfaceMaterial name={material} tone={0.4} />
      </mesh>
      <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 1.15, 0.12, 32]} />
        <SurfaceMaterial name={material} tone={0.48} />
      </mesh>
      {[
        [-0.8, -0.8],
        [0.8, -0.8],
        [-0.8, 0.8],
        [0.8, 0.8],
      ].map(([x, z], i) => (
        <Column key={i} x={x} z={z} h={1.1} r={0.08} material={material} />
      ))}
      <mesh position={[0, 1.36, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.02, 1.02, 0.12, 24]} />
        <SurfaceMaterial name={material} tone={0.56} />
      </mesh>
      <Dome radius={0.96} baseY={1.42} material={material} />
      <mesh position={[0, 2.44, 0]} castShadow>
        <coneGeometry args={[0.08, 0.32, 8]} />
        <SurfaceMaterial name={material} tone={0.5} />
      </mesh>
    </group>
  );
}

export function SceneContents({ space, weather, quality = "full" }: { space: ComposedSpace; weather: WeatherMode; quality?: SceneQuality }) {
  const { params } = space;
  const recipe = RECIPE[params.emotion];
  const skyDim = weather === "storm" ? 0.6 : weather === "rain" ? 0.78 : weather === "cloudy" || weather === "snow" ? 0.88 : 1;
  const keyIntensity = (0.72 + params.lightIntensity * 1.35) * skyDim * recipe.keyBoost;
  const warmKey = params.lightWarmth > 0.55 ? "#FFF1DE" : params.lightWarmth < 0.35 ? "#EAF3F7" : C.white;
  const showSky = weather === "clear" || weather === "cloudy";
  const shadowSize = quality === "full" ? 1024 : 512;
  const contactResolution = quality === "full" ? 1024 : 512;

  return (
    <group>
      {showSky && (
        <Sky
          distance={450}
          sunPosition={recipe.sun}
          turbidity={weather === "cloudy" ? 12 : 6}
          rayleigh={weather === "cloudy" ? 3 : 1.4}
          mieCoefficient={0.006}
          mieDirectionalG={0.8}
        />
      )}

      {/* 草地(基色随情绪:生机 ↔ 枯槁) */}
      <RoundedBox args={[13, 0.5, 8.5]} radius={0.14} smoothness={3} position={[0, -0.25, 0]} receiveShadow>
        <meshStandardMaterial color={recipe.grass} roughness={1} />
      </RoundedBox>
      <GroundDetails space={space} quality={quality} />
      <EmotionGround emotion={params.emotion} seed={space.seed} />

      {space.archetype === "plaza" && (
        <group position={[0, 0, 0]}>
          <PlazaGround radius={2.5} material={params.material} />
          <group position={[0, 0.17, 0]}>
            <Obelisk material={params.material} />
          </group>
        </group>
      )}
      {space.archetype === "court" && (
        <group position={[0, 0, 0]}>
          <PlazaGround radius={2.1} material={params.material} />
          <Pavilion material={params.material} />
        </group>
      )}

      {space.blocks.map((b, i) => (
        <Block key={i} b={b} index={i} material={b.material ?? params.material} style={params.architectureStyle} />
      ))}
      {space.vegetation.map((v, i) => (
        <Plant key={i} v={v} />
      ))}
      <ExtraPlanting space={space} quality={quality} />
      <PeopleField space={space} quality={quality} />
      <PathLine path={space.path} />

      {/* 每情绪的专属戏剧元素 */}
      {params.emotion === "sad" && <LoneTree x={-0.8} z={0.6} />}
      {params.emotion === "scared" && <SearchBeam />}
      {params.emotion === "mad" && <FloatingShards seed={space.seed} />}
      {params.emotion === "joyful" && <PetalFall />}
      {params.emotion === "calm" && <GroundMist />}
      {params.emotion === "confident" && space.archetype === "plaza" && <LightAxis material={params.material} />}

      <SkyClouds mode={weather} />
      <Precipitation mode={weather} />
      {weather === "storm" && <Lightning />}

      {/* drei <SoftShadows> 已移除:它改写的 PCSS 阴影着色器调用 unpackRGBAToDepth(texture2D(...)),
          与 three r185 的阴影贴图不兼容,片元着色器编译失败,投影整片消失。用 PCFShadowMap 自带的软阴影。 */}
      <StudioEnv warmth={params.lightWarmth} />

      <hemisphereLight args={["#dff0ff", recipe.grass, 0.55 * skyDim * recipe.ambientBoost]} />
      <ambientLight intensity={(0.26 + params.lightIntensity * 0.24) * skyDim * recipe.ambientBoost} />
      <directionalLight position={[-6, 4, -4]} intensity={0.28 * skyDim} color="#cfe0ea" />
      <directionalLight position={[-3, 3, 6]} intensity={0.2 * skyDim} color={warmKey} />
      <directionalLight
        position={recipe.sun}
        intensity={keyIntensity}
        color={warmKey}
        castShadow
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
      />
      <ContactShadows position={[0, 0.03, 0]} opacity={0.5} width={13} height={9} blur={2.6} far={8} resolution={contactResolution} color={C.black} />
    </group>
  );
}

export default function SpaceScene({ space, weather = "clear", quality = "preview" }: { space: ComposedSpace; weather?: WeatherMode; quality?: SceneQuality }) {
  const env = envFor(weather, space.params.emotion);
  const isFull = quality === "full";
  return (
    <Canvas
      shadows={isFull}
      orthographic
      frameloop={weather === "clear" ? "demand" : "always"}
      dpr={isFull ? [1, 1.5] : [1, 1.25]}
      camera={{ position: [11, 9, 11], zoom: 42, near: -50, far: 100 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.04;
        gl.shadowMap.type = THREE.PCFShadowMap;
        gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault(), false);
      }}
      resize={{ scroll: false, offsetSize: true }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <color attach="background" args={[env.bg]} />
      <fog attach="fog" args={[env.bg, env.near, env.far]} />
      <SceneContents space={space} weather={weather} quality={quality} />
      <OrbitControls enablePan={false} minZoom={26} maxZoom={80} maxPolarAngle={Math.PI / 2.15} target={[0, 0.5, 0]} makeDefault />
    </Canvas>
  );
}

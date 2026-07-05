# Mood Builder — webapp

A portfolio web build of **Mood Builder**, a generative architectural framework that
translates an emotional state into an evolving, weathered isometric space.

Each day fuses a **subjective** self-report (an emotion wheel) with **objective**
physiological signals (HRV, resting heart rate, skin conductance, motion) into an emotion vector, then a
deterministic engine maps that vector to spatial parameters and composes a small 3D
space. Days stack into a temporal record (the Observation Deck).

This webapp is the interactive companion to the academic portfolio boards. The numbers
and forms that are hardcoded in the static boards are **computed live by the engine** here.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Cover. Server-renders one real engine read-out from a sample input. |
| `/app` | The application. Emotion wheel + physiological sliders → live engine → generative 3D space. Includes **Save snapshot** persisted to localStorage on the device. |
| `/research` | Global Research board — why the project exists, as a spatial brief. |
| `/translation` | Translation Database — emotion family → material / roof / light / weather / soundscape. |
| `/logic` | Logic Diagram — the closed translation loop + the 14-screen mobile build order. |
| `/deck` | Observation Deck — interactive stack of daily platforms with an **altitude slider** and an **affective trace**. |

Site-wide: scroll-reveal entrances (`components/Reveal.tsx`), animated text underlines
(`.ulink`) and hover lift (`.lift`). All motion respects `prefers-reduced-motion`, and
first-screen content is always visible (no JS-dependent first paint).

## Engine (the "backend" logic)

`lib/engine/`
- `translation-db.ts` — emotion → architectural vocabulary (the project's core IP).
- `evolution-engine.ts` — dual-stream fusion: physiological + subjective → emotion vector → spatial parameters.
- `composer.ts` — deterministic procedural massing / vegetation / path from parameters + a seed.
- `types.ts` — shared types.

`lib/portfolio/content.ts` builds 14 sample daily platforms from the engine for the boards.

## Persistence

The app is intentionally **client-only**: check-ins persist in `localStorage`
(`lib/app/store.ts`) — no backend, no network, works offline. The old
`/api/snapshots` in-memory demo route was removed (nothing referenced it) so the
whole app can be exported as a fully static site.

## Static export (portfolio embed)

`npm run build:portfolio` builds a static export to `out/` with
`basePath: /moodbuilder` (config in `next.config.ts`, gated by `MB_STATIC=1`).
Copy `out/` to the portfolio site's `moodbuilder/` folder — it is embedded at
https://rainzhao01.netlify.app/ inside the Mood Builder project detail (iframe +
"open full app" link). Regular `npm run dev` / `npm run check` are unaffected.

## Run

Node is installed portably on this machine; put it on PATH first:

```powershell
$env:Path="C:\Users\Rain\AppData\Local\Programs\nodejs;$env:Path"
cd webapp
npm install
npm run dev      # http://localhost:3000  (or use ..\run-dev.cmd from the repo root)
```

## Test / build

```powershell
npm run check    # tsc --noEmit  +  next build  (the ground-truth gate)
npm run typecheck
npm run build
```

## Tech stack

- Next.js (App Router) + React + TypeScript
- `@react-three/fiber` + `@react-three/drei` (Three.js) for the generative 3D space
- Design tokens ported faithfully from the Mood Builder design system into `app/globals.css`; fonts self-hosted under `public/fonts`

## Network: fully self-hosted (works offline / in mainland China)

The shipped bundle fetches **nothing** from external CDNs — it opens on any network,
including mainland China without a proxy. Verified: a grep of the production `.next`
output finds zero references to `fonts.googleapis`, `gstatic`, `unpkg`, `jsdelivr`,
`cdnjs`, `polyfill.io`, analytics, or `raw.githack`.

- Fonts are self-hosted under `public/fonts/*.woff2` (no Google Fonts, no `next/font`).
- The world map topojson is self-hosted at `public/world-110m.json` (no unpkg at runtime).
- The only external reference is one **clickable** `<a href="ourworldindata.org…">`
  attribution link — it loads nothing until clicked, so it never blocks the page.

**Hard constraint — keep it CDN-free:** do not reintroduce remote runtime assets. In
particular, when refining the 3D scene, do **not** use drei `<Environment preset="…">`
or `useEnvironment({ files: <url> })` (those pull HDRIs from a CDN that is blocked/slow
in China). Build the environment locally (Lightformers / a gradient cube) or bundle an
HDRI under `public/`.

**Hosting note:** the code is CDN-free, but it must still be *served* from a host
reachable in China. The app is now fully static (persistence is client-only
`localStorage`), so `npm run build:portfolio` + any static host / object storage works.

## Known limitations

- Persistence is per-browser `localStorage` — no account, no sync across devices.
- The `/app` 3D scene needs a real WebGL context; verify it fills its container in a
  normal browser. (A headless/virtualized renderer can leave the canvas at its default
  300×150 — that is an environment limitation, not a layout bug; the container is sized
  via a stable `position:absolute; inset:0` parent.)
- The 14 mobile screens are documented as a build order on `/logic`; the live app
  implements the core record → generate loop rather than all 14 screens.

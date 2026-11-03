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

## Static export

Two static builds, both written to `out/` (config in `next.config.ts`, gated by `MB_STATIC=1`):

| Script | Served from | Use |
| --- | --- | --- |
| `npm run build:static` | site root `/` | The standalone live demo on Netlify (`netlify.toml` at the repo root runs this). |
| `npm run build:portfolio` | `/moodbuilder/` | Copy `out/` into the portfolio site's `moodbuilder/` folder. |

Both also copy the single-file mobile prototype (`../Mood Builder - Prototype.html`) to
`out/prototype/` via `scripts/add-prototype.mjs`. Regular `npm run dev` / `npm run check`
are unaffected.

**Sub-path rule:** `next/link` adds the base path automatically, but `next/image` string
`src`, `fetch()` and plain `<img>` do not. Any file under `public/` must be referenced through
`withBase()` from `lib/base-path.ts`, or it will 404 under `/moodbuilder/`. Fonts live in
`app/fonts/` and are imported relatively from `globals.css`, so Next bundles them and they
work under any base path.

## Run

Requires Node.js 20.9+ (Netlify builds with Node 22).

```bash
cd webapp
npm install
npm run dev      # http://localhost:3000
```

## Test / build

```bash
npm run check    # tsc --noEmit  +  next build  (the ground-truth gate)
npm run typecheck
npm run build
```

## Tech stack

- Next.js (App Router) + React + TypeScript
- `@react-three/fiber` + `@react-three/drei` (Three.js) for the generative 3D space
- Design tokens ported faithfully from the Mood Builder design system into `app/globals.css`; fonts self-hosted under `app/fonts`

## Network: fully self-hosted (works offline / in mainland China)

The shipped bundle fetches **nothing** from external CDNs — it opens on any network,
including mainland China without a proxy. Verified: a grep of the production `.next`
output finds zero references to `fonts.googleapis`, `gstatic`, `unpkg`, `jsdelivr`,
`cdnjs`, `polyfill.io`, analytics, or `raw.githack`.

- Fonts are self-hosted under `app/fonts/*.woff2` (no Google Fonts, no `next/font`).
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

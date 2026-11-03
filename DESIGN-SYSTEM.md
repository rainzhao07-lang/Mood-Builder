# Mood Builder — Design System

**Mood Builder** is a mobile experience that translates a person's emotional
state into a *growable space*. Each day you record how you feel — through a
subjective self-report (an emotion wheel) and objective physiological signals
(HRV, skin conductance, motion). The system fuses these into an emotion vector,
then a **Spatial State Engine** composes a small isometric "space" (weathered,
overgrown stone — calm but alive). Over weeks those daily spaces stack into a
3D temporal record you can compare, get insights from, and step *inside* in a
first-person immersive mode.

The product language is **quiet, near-clinical and healing**: misty
blue‑grey‑greens on warm off‑white paper, a deep slate interaction color, and
warm gold reserved only for progress/stage emphasis. Lots of whitespace, soft
generous rounding, slow settling motion. Headlines are the editorial serif
**Fraunces** (occasionally italic); body and UI are **Hanken Grotesk**.

> The framework's own name for the model is the **Affective Spatial Evolution
> Framework**: Subjective Input + Objective Input → Emotion State Engine
> (normalize → weight & fuse → map → calibrate) → Spatial State Engine
> (parameters → domain rules → variants → compose) → Temporal Layer
> (time gate → snapshot → building → compare → archive → insights).

---

## Sources this system was built from

- **An earlier 10‑screen clickable mobile prototype** — the structural base
  (Observe → Record → Subjective → Calibrate → Generate → Adjust → Temporal →
  Insights → Compare → Immersive). The token CSS and the screen flow are
  derived from it. The rebuilt flow lives in `ui_kits/mood-builder-app/` and is
  bundled as a single file in `Mood Builder - Prototype.html`.
- **`uploads/P45.png`** — *"Affective Spatial Evolution Framework"* board: all
  ten phone screens rendered in the target visual style, plus the system flow
  diagram and the first‑person immersive interior photo. The isometric "space"
  renders and the immersive photo in this system were **cropped from this
  board** (see `assets/renders/`).
- **P46 board** — the tablet *"Observation Deck"* immersive view: an
  exploded stack of daily platforms with mood annotations, an altitude slider
  and an affective‑trace chart. Kept as `assets/renders/tablet-observation-deck.jpg`
  (full 4961 × 3508 resolution, re‑encoded from the original 17 MB PNG).

Both reference boards are preserved at full resolution in
`assets/renders/framework-board.png` and `assets/renders/tablet-observation-deck.jpg`.

---

## Content fundamentals — how Mood Builder writes

- **Voice:** second person, calm and observational. *"Each day you record how
  you feel. The space remembers, and grows."* The app addresses **you**; it
  never refers to itself as "I" and never cheerleads.
- **Register:** clinical‑but‑warm. Copy borrows from instruments and field
  notes ("Validating your estimate", "Subjective input captured", "Captured ·
  Day 14 · 09:41 · Calm 0.62") but stays gentle. No exclamation marks, no hype.
- **Casing:** Title Case for screen/section labels and buttons
  ("Record Today", "Activate Interaction", "View Insights"); sentence case for
  ledes and helper text. UPPERCASE only for tiny eyebrows and meta labels
  ("SELF‑REPORT", "PHASE", "STAGE 2 / 5"), always letter‑spaced.
- **Titles** are short, slightly literary serif fragments, often broken across
  two lines and sometimes ending in an italic question: *"Where does it / feel
  most true?"*, *"Your space, / from today's mood"*, *"A 3D record / of your
  weeks"*.
- **Numbers** are first‑class and quiet: emotions carry a 0–1 score
  ("Calm · 0.62"), signals carry units ("72 ms", "Low", "Minimal"), changes are
  signed deltas ("−8%", "+12%"). Metric *values* are set in Fraunces; units and
  qualifiers in Hanken.
- **Punctuation:** the middot ` · ` is the house separator for meta strings.
  Em‑dashes introduce a driver/explanation ("more serene & open — driven by
  your Calm state"). Ampersands are fine in short phrases.
- **No emoji.** Status is shown with a small tinted dot + a word ("● Stable"),
  never with an emoji or a bright alert color.
- **Vibe in one line:** a therapist's notebook rendered as software — measured,
  spacious, trustworthy, never loud.

---

## Visual foundations

**Palette.** Three families on warm paper. *Slate* (`#2f3e42` and darker) is the
single interaction + primary‑text color. *Sage / mist / band*
(`#8fa39a` `#9fb2b3` `#aebfca`) is the calm emotional accent and the pale blue
"transition band". *Paper / panel* neutrals (`#f4f5f2` screen, `#dde4e2` cards,
`#d7dcd8` app chrome) carry everything. **Gold** (`#bb9a62`) is *reserved* — it
appears only on stage/progress tracks, never as a button or large fill. Status
hues are deliberately desaturated; "alert" is a soft clay (`#a3705f`), never a
saturated red. Tokens live in `tokens/colors.css` (base ramps + semantic
aliases like `--surface-card`, `--text-body`, `--interactive`, `--accent-progress`).

**Type.** Fraunces (display, opsz ~96, weight 500, tracking −0.01em, optional
italic) for titles, the wordmark, **primary buttons** and metric values; **Newsreader**
(text serif) set *italic* for editorial captions and helper lines; Hanken Grotesk
(300–700) for plain UI, status and controls. Geist / Geist Mono are available as
an alternate sans and for dense numerics. Body is 13–13.5px / 1.6; ledes wrap with
`text-wrap: pretty`. See `tokens/typography.css`.

**Space & rhythm.** 4px base, but the brand *breathes* — 22px screen gutters,
generous vertical gaps, content centered with lots of negative space. Mobile hit
targets ≥ 44px. `tokens/spacing.css`.

**Shape.** Soft, generous rounding everywhere: tiles `14px`, cards/buttons/inputs
`16px`, chips/pills full‑round, the device viewport `36px`. No sharp corners.
`tokens/radius.css`.

**Surfaces & elevation.** Cards are **borderless** — separation comes from a
soft tonal step (paper → panel‑300 → panel‑400), not outlines or heavy shadows.
Shadows are diffuse, cool and low‑contrast, like overcast daylight
(`--shadow-card` is a 12px, 14%‑opacity slate blur). The only strong shadow in
the system is the phone shell itself.

**Backgrounds.** Screens are flat warm paper. The app chrome behind a device
uses a very subtle radial wash (`radial-gradient(... #e4e8e4, transparent)` over
panel‑500). No busy gradients, no patterns, no texture overlays. The one
exception is **imagery**: the emotion‑driven *renders* — isometric stone‑and‑
vegetation "spaces" and the first‑person ruin interior — are the hero visual
moments, always presented full‑bleed inside a rounded tile.

**Imagery vibe.** Warm, weathered, slightly overgrown architectural renders;
soft natural light, muted greens and stone greys, gentle haze. Isometric
"spaces" sit on a pale band; the immersive photo is a sun‑warmed gothic ruin
path. Calm but alive.

**Buttons & signatures.** Primary buttons are full‑width **outlined pills**
(slate hairline, paper interior) with **Fraunces serif** labels that fill slate
on hover; a soft filled‑panel pill is the secondary action above them. The
refined buttons, the flat sage **emotion wheel**, and pervasive *italic
Newsreader captions* are the signatures of the P45/P46 visual refresh.

**Motion.** Slow and settling. Screen transitions are a 0.42s fade‑and‑rise
(`--ease-settle`, `cubic-bezier(0.22,0.61,0.36,1)`). Progress/marker moves ease
over 0.24s. **Press** state shrinks to `scale(.98)`; **hover** darkens the slate
fill one step or adds a ~5% slate tint on ghost surfaces (never a glow). No
bounces, no infinite loops, respect `prefers-reduced-motion`.

**Layout rules.** Every flow screen is: scrolling `body` (22px gutter) + a fixed
`footer` holding a single full‑width primary action. A `topline` carries an
optional back link and the screen name. Eyebrow → serif title → lede is the
standard header stack.

---

## Iconography

Mood Builder is **near icon‑free by design** — it leans on type, tinted dots and
the renders instead of an icon set. What it does use:

- **Status dots:** a 6px tinted circle + a word ("● Stable", "● Tracking"). The
  dot color comes from `--signal-rest / warn / alert`. This is the primary
  "iconography" of the calibrate/insights screens.
- **Unicode glyphs, sparingly:** the hourglass `⧗` on the Observe screen, the
  chevron `‹` for back/exit, the compare handle arrows `⇄`, and the status‑bar
  marks. These are set in the UI font, not an icon font.
- **No emoji, no illustration icons, no logo mark** beyond the **wordmark**
  ("Mood *Builder*", Fraunces with an italic accent on *Builder* — see
  `guidelines/brand-wordmark.html`).
- **If you need functional icons** later (settings, share, etc.), use a thin,
  rounded, single‑weight set (e.g. **Lucide** at ~1.5px stroke) tinted
  `--text-body`; never fill them and never use two weights. *(No icon set ships
  with this system today — this is a recommendation, flagged for the team.)*

Real visual assets live in `assets/renders/`:
`space-iso-open.png`, `space-iso-lush.png`, `space-iso-detail.png` (isometric
spaces), `immersive-ruins.png` (first‑person interior),
`tablet-observation-deck.jpg` and `framework-board.png` (the source boards).

---

## Index — what's in this project

**Foundations**
- `styles.css` — the single entry point consumers link (`@import`s only).
- `tokens/colors.css` · `typography.css` · `spacing.css` · `radius.css` · `fonts.css`.
- `guidelines/*.html` — specimen cards (Colors, Type, Spacing, Brand) shown in
  the Design System tab.

**Components** (`window.MoodBuilderDesignSystem_426a1b.*`)
- `components/buttons/` — **Button** (primary / ghost / quiet / onDark).
- `components/surfaces/` — **Card**, **MetricStat**, **SpaceTile**.
- `components/data/` — **StageBar**, **ProgressBar**, **SignalRow**, **Chip**.
- `components/inputs/` — **Slider**, **EmotionWheel**.
- `components/frame/` — **PhoneFrame** (device shell).

**UI kit**
- `ui_kits/mood-builder-app/` — the full 10‑screen clickable mobile flow
  (`index.html` + `app.jsx` + `screens.jsx`), composed entirely from the
  components above, with the real renders swapped into every tile.

**Assets**
- `assets/renders/` — spatial renders, the immersive photo, and the two source
  boards.

**Skill**
- `SKILL.md` — makes this folder usable as a downloadable Agent Skill.

---

## Notes & open items

- **Fonts** are **self-hosted** as `.woff2` in `assets/fonts/` (Fraunces normal +
  italic, Newsreader, Hanken Grotesk, Geist Sans, Geist Mono); `tokens/fonts.css`
  declares every `@font-face`. No external CDN dependency remains.
- **No functional icon set** ships yet — see Iconography for the recommendation.
- The isometric renders were cropped from the P45 board, so they're modest
  resolution. Swap in higher‑res exports when available.

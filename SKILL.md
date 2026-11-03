---
name: mood-builder-design
description: Use this skill to generate well-branded interfaces and assets for Mood Builder, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `DESIGN-SYSTEM.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Quick map:
- `DESIGN-SYSTEM.md` — full design guide: content fundamentals, visual foundations, iconography, manifest.
- `styles.css` + `tokens/` — link `styles.css` for all tokens (colors, type, spacing, radius) and the webfonts.
- `guidelines/*.html` — foundation specimen cards.
- `components/` — React UI primitives (Button, Card, SpaceTile, StageBar, ProgressBar, SignalRow, Chip, Slider, EmotionWheel, PhoneFrame). Each folder has a `.d.ts`, a `.prompt.md`, and a demo card.
- `ui_kits/mood-builder-app/` — the full 10-screen clickable mobile flow to copy from.
- `assets/renders/` — the spatial renders, immersive photo, and source boards.

Brand in one breath: quiet, near-clinical healing. Misty blue-grey-greens on warm off-white paper, deep slate interaction color, warm gold for progress only. Fraunces serif titles (occasional italic), Hanken Grotesk body. Generous whitespace, soft rounding, slow settling motion, no emoji.

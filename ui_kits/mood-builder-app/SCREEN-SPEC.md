# Refined screen spec (harvested from uploads/*.svg + 第三页.png)

Visual language confirmed by the SVGs + the page-3 PNG:
- **Primary button** = full-width **outlined pill** (rx = half height), **Fraunces serif** label, slate text/border, paper interior. NOT a filled slate rect.
- **Secondary action** (some screens) = a lighter **filled panel pill** sitting just above the primary (e.g. "Back to Archive", "Save to Archive", "Compare Variants").
- **Helper / caption text** = italic (Newsreader italic), slate-body, centered under the relevant block.
- **Eyebrow / section labels** = Fraunces or Hanken small.
- Cards = generously rounded (rx ~82/1314 ≈ 21px at 340 width).
- Status dots: "● Stable / ● Tracking / ● Detected".
- Big numbers / metric values = Fraunces.

## Page → screen copy

1. **Observe** — centered logo; "A system that translates emotional states into evolving spaces."; button **Observe**.
2. **Home (PHASE)** — eyebrow `PHASE` (L) · `Day 14 / Week 3` (R). Card: `Emotion State` → `Calm` ; helper *"Estimated from subjective and physiological input."* Energy/Pleasantness field w/ dot. Lower card: `Stage 2 / 5` · `Spatial State` ; *"Spatial system evolving"* ; progress bar ; *"Next stage in 3 days"*. *"Spatial configuration at current stage"*. Button **Record Today** ; helper *"Log emotional and physiological inputs"*.
3. **Subjective** (PNG) — helper top-right *"Log emotional and physiological signals"* ; EmotionWheel (CONFIDENT/CALM/SCARED/SAD/MAD/JOYFUL, 6 spokes, scatter dots) ; *"Place where it feels most accurate to you"* ; **Subjective input captured** (bold italic) ; *"System calibration in progress"* ; button **Continue**.
4. **Calibrate** — title *"Physiological signals detected / Used to calibrate emotional state"*. Rows: `Heart Rate Variability` `72 ms` `● Stable` ; `Skin Conductance` `Low fluctuation` `● Tracking` ; `Motion` `Minimal` `● Detected`. Button **Continue**.
5. **Generate** — `Space Generated` (top-right). label `Space Visualization Section`. *"Space now feels more serene and open due to Calm state"*. secondary pill **Activate Interaction**. *"Emotion-driven space generated · 50% complete"*. Button **Next**.
6. **Adjust** — `Space Adjustment`. Sliders: Element Density, Color Tone, Lighting Intensity, Layout Style. Button **Next**.
7. **Temporal Layer** — `< Back` · `Temporal Layer` (R) · `Stage 2 / 5`. *"Time-gated snapshots of evolving space"*. `Current Snapshot` ; `Captured · Day 14 · 09:41` ; `Calm · 0.62` ; *"Drag to rotate · Pinch to zoom"*. Time Gate slider Past→Now ; *"Selected: Day 11"* ; `Lighting −8%` ; *"Next update in 3 days"* ; Day 11 … Day 14. Button **View Insights**.
8. **Insights** — `< Back` · `Insights` · `Calm · 0.62` · `⋯`. `Stage 2 / 5`. *"Last 14 days · Updated Day 14 · 09:41"*. **Key Changes**: Lighting `−8%` *"Softer contrast, reduced highlights"* ; Element Density `+12%` *"More vegetation + micro-structures"* ; Layout `More linear` *"Fewer turns, clearer path"*. **Drivers**: Objective Input `55%` *"HRV remained stable → calm weighting increased."* ; Subjective Input `45%` *"Your placement confirmed the emotion-space mapping."* **Archive**: chips Day 3 / Day 7 / Day 11 / Day 14 ; "View all" ; *"Tap a day to open its snapshot."* Button **Save Snapshot**.
9. **Archive** — `Archive` · `⋯`. *"Last 14 days · 14 snapshots"*. filter chips: All / By Stage / By Emotion / By Change. Cards: Day 14 `Calm · 0.62` Stage 2/5 *"Open layout · softer light"* `Lighting +8%` `Element density +12%` ; Day 11 `Scared · 0.58` Stage 2/5 *"Narrow path · higher contrast"* `Lighting −8%` `Layout more fragmented` ; *"Tap to open snapshot"*. Button **Compare selected**.
10. **Compare** — `Compare` · `⋯`. *"Differences between selected snapshots"*. Row A: Day 11 · 22:10 `Scared · 0.58` Stage 2/5 ; Row B: Day 14 · 09:41 `Calm · 0.62` Stage 2/5. Before/After drag slider (*"Drag to compare"*). *"Change focus: lighting · vegetation · path continuity"*. secondary pill **Back to Archive** ; Button **Open Timeline**.
11. **Timeline** — `Timeline` · `⋯` · `Stage 2 / 5`. *"Last 14 days · 14"*. Selected Snapshot (3D, `Day 14 · 09:41` `Calm · 0.62`, *"Drag to rotate · Pinch to zoom"*). **Emotion Trend** *"Score across recent snapshots"* `Δ +0.04` `Range 0.48–0.62`. Two snapshot cards (Day 14 / Day 11). Button **Compare Selected**.
12. **Snapshot Detail** — `Snapshot Detail` · `⋯`. Selected Snapshot 3D (`Day 14 · 09:41` `Calm · 0.62`, drag/zoom). **What changed**: Lighting +8% *"Softer contrast, fewer highlights"* ; Element Density *"More vegetation + micro-structures"* ; Layout More linear +12% *"Fewer turns, clearer path"*. **Drivers**: Objective input 55% / Subjective input 45% ; *"HRV remained stable → calm weighting increased."* ; *"Your placement confirmed the emotion–space mapping."* secondary pill **Save to Archive** ; Button **Export Summary**.
13. **Variants** — `Variants` · `⋯`. `Selected Variant` (3D, drag/zoom). *"Select a version to continue composing"*. **Quick Differences**: Element Density (Calm +12% / Scared −4% / Sad +6%) ; Lighting (Calm +8% / Scared −8% / Sad −12%). *"These variants are rule-constrained from your current emotion vector."* secondary pill **Compare Variants** ; Button **Choose Variant**.
14. **Immersive** — full-bleed first-person interior photo, `< Back` overlay only.

# Process notes

Working documents from building Mood Builder, kept as a record of how the project was made.
They are written in Chinese and reflect the state of the project on the date in each file name,
so paths and to-dos inside them may be out of date.

The web app was built with two AI coding assistants, Claude Code and Codex, passing work
back and forth: one builds, the other reviews against a single brief, and I make the call.
The repo was the single source of truth, so every handoff was written down. These are those
briefs and reports.

| File | What it is |
| --- | --- |
| `CLAUDE-HANDOFF.md` | Handoff from Codex to Claude: state of the design system, web build and Figma masters |
| `CLAUDE-FIX-REQUEST-20260629-0512.md` | Review findings sent back for fixing (first-screen reveal, copy vs. renders, README) |
| `CLAUDE-FIX-RESPONSE-20260629-0512.md` | Item-by-item response to that fix request |
| `CLAUDE-HANDOFF-NEXT-20260629.md` | Brief handed to Codex for the next phase of the web app |
| `CODEX-SYNC-STATUS-20260629.md` | Codex's progress, reconstructed by Claude from the files on disk after Codex ran out of quota |
| `CODEX-REVIEW-REQUEST.md` | Change summary handed to Codex for review |
| `CONTEXT-HANDOFF-20260630.md` | Context handoff so a fresh session can continue |
| `HANDOFF-CLAUDE-20260702.md` | Handoff after the switch to a real mobile app (`/app`): decisions, corrections and roadmap |
| `FIGMA-BUILD-GUIDE.md` | How to rebuild the 14 mobile screens in Figma from the tokens |
| `FIGMA-REVIEW-NOTES.md` | Notes from a Figma correction pass (that Figma file has since been replaced) |
| `RENDER-ASSET-SPEC.md` | Spec for the layered render library the app will compose from (`webapp/lib/app/asset-manifest.ts`) |

Shows one emotion-driven spatial render. Isometric "spaces" use the default contain fit; immersive interior photos use `cover`.

```jsx
<SpaceTile src="assets/renders/space-iso-open.png" height={170} caption="Spatial configuration · Stage 2" />
<SpaceTile src="assets/renders/immersive-ruins.png" cover height={300}
  metaLeft="Captured · Day 14" metaRight="Calm · 0.62" />
```

Renders read warm, weathered and overgrown. When `metaLeft`/`metaRight` are set, a soft paper scrim fades up from the bottom for legibility.

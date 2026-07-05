Pale panel container that groups content on a screen. Pair with `MetricStat` for labelled readouts.

```jsx
<Card>
  <MetricStat label="Emotion State" value="Calm" unit="0.62" />
</Card>
<Card tone="deep" elevation="raised">…</Card>
```

Tones: `default` (panel-300), `deep` (panel-400 track), `paper` (paper-200). Elevation `flat` (default) or `raised`. Keep cards borderless — separation comes from the soft tonal step, not outlines.

Circular self-report control for the Subjective Input screen — drag the marker across the Calm / Joyful / Sad / Scared field.

```jsx
<EmotionWheel defaultX={0.38} defaultY={0.42}
  onChange={(lean, pos) => console.log(lean, pos)} />
```

Reports the leaning quadrant label (Calm, Joyful, Sad, Scared, Mad, Confident, Neutral). Works with mouse and touch.

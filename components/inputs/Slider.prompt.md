Labelled range slider for the Space Adjustment screen. `mode` maps the number to a word.

```jsx
<Slider label="Element Density" defaultValue={52} mode="percent" />
<Slider label="Color Tone" defaultValue={40} mode="tone" />
<Slider label="Layout Style" defaultValue={30} mode="layout" />
```

Uncontrolled by default; pass `value` + `onChange` to control. Thumb is slate; track is panel-400.

Primary action button — the single committing action at the bottom of each Mood Builder screen. The refined CTA is a full-width **outlined pill** with **Fraunces serif** text that fills slate on hover.

```jsx
<Button variant="primary" size="lg" onClick={next}>Record Today</Button>
<Button variant="secondary" size="lg">Back to Archive</Button>
<Button variant="quiet" size="sm">‹ Back</Button>
<Button variant="onDark" size="lg">Exit</Button>
```

Variants: `primary` (outlined slate pill, serif — default CTA), `secondary` (soft filled panel pill, sits just above the primary on multi-action screens), `solid` (filled slate, rare strong commit), `quiet` (text-only back/inline link, sans), `onDark` (outlined for immersive dark screens).
Sizes: `lg` full-width footer action (serif, default), `md` compact (serif), `sm` inline auto-width (sans). Press shrinks to .985; never use bright/saturated fills.

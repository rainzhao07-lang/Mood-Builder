iPhone-style device shell for framing Mood Builder screens. Put your screen content (scrolling body + footer) as children.

```jsx
<PhoneFrame>
  <div style={{flex:1, overflowY:'auto', padding:'6px 22px'}}>…</div>
  <div style={{padding:'14px 22px 26px'}}><Button>Record Today</Button></div>
</PhoneFrame>

<PhoneFrame dark screen="var(--surface-immersive)">…</PhoneFrame>
```

Notch + status bar are built in. Use `dark` for the immersive screen so the status text reads light.

# Figma 修正记录

文件: https://www.figma.com/design/v1xmYsiTyLpLJ3cx5n0KVy/Untitled

## 已完成

- 在 `01 · UI System` 页修正 `ScreenTitle` 母版:
  - `Title 1` / `Title 2`: Fraunces Regular, 24px, line-height 27px, letter spacing -1%。
  - `Description`: Hanken Grotesk Regular, 13.5px, line-height 22px。
  - `Eyebrow`: Hanken Grotesk Bold, 11px, line-height 14px, letter spacing 14%。
- 在 `MB/Action/Button` 的 `Primary / Light` 变体上修正主按钮方向:
  - 按钮从深色实心改成纸色内底。
  - label 改为 Fraunces Regular 15px, line-height 20px。
  - label fill 改为 `#2F3E42`。
- 回到 `02 · iPhone 17 Pro Max Screens` 页验证:
  - 屏幕标题已传导为 24/27/-1%。
  - 底部主按钮已传导为描边/纸色形态,文字恢复可见。

## 仍需处理

- 画板仍是 iPhone 17 Pro Max 宽度,不是设计系统基准 `340 × 710`。这是“字号看起来偏小、留白偏空”的结构原因。建议下一轮单独做画板缩放和重排,不要和组件样式一起混改。
- `Primary / Light` 按钮描边新增成功,但 Figma 色板没有稳定接受 `#2F3E42`;当前可能仍是黑色描边。需要人工或下一轮精确修成 slate。
- 14 屏中仍有部分独立文本可能没有挂到共享组件/样式,尤其是 hero 标题、caption、note/italic。需要逐屏检查并重连样式。
- `Newsreader italic` 说明文字还需要全局巡检。这是作品集气质里很重要的细节。
- Observation Deck 那张屏需要最高优先级精修:平台堆叠、Altitude slider、affective trace 目前仍应按作品集图强化。

## 下一轮 Figma 修改顺序

1. 只处理画板尺寸与布局密度:确认是否从 440 宽改回 340 宽。
2. 逐屏重链文字样式: hero/title/body/caption/eyebrow/note italic。
3. 修按钮描边颜色为 `#2F3E42`,并清理不必要的 dark primary 误用。
4. 精修 13 Observation Deck 和 14 Immersive,它们是作品集视觉记忆点。
5. 最后检查 prototype 连线: Observe → Home → Subjective → Calibrate → Generate → Adjust → Temporal → Insights → Archive → Compare → Timeline → Snapshot → Variants → Immersive。

# Claude 修复交接单：Mood Builder webapp 20260629-0512

## 交付结论

当前 zip：`E:\Desktop\Mood Builder webapp - Claude 20260629-0512.zip`

这份包可以通过 `npm run check`，但不能作为最终作品集交付。它目前更像一轮动效和 3D 稳定性补丁，仍存在首屏 Reveal 风险、文案与真实渲染不一致、README 默认模板残留，以及 Claude 自己标注的未完成范围。

请不要只做表面文字修正。目标是把它补到作品集交付水准：视觉、交互、前端结构、后端接口说明和验证记录都要闭环。

## 必须修复

### P1：修复 Reveal 首屏隐藏风险

相关文件：

- `app/layout.tsx`
- `app/globals.css`
- `components/Reveal.tsx`

当前问题：

- `layout.tsx` 在 body 顶部立即执行 `document.documentElement.classList.add('js')`。
- `globals.css` 中 `html.js [data-reveal]` 会先隐藏元素。
- `Reveal.tsx` 初始 `shown=false`，必须等 hydration 后 `useEffect` 才显示。

这会导致慢网速、慢 hydration 或 JS 失败时，首屏内容可能短暂空白。交付中不能接受。

修复要求：

- 首屏内容默认必须可见。
- 非首屏内容可以滚动入场。
- 不要为了动效全局使用粗暴的 `suppressHydrationWarning`。
- 优先方案：
  - CSS 默认可见；
  - 客户端 mounted 后只对可增强区域启用 reveal；
  - 或给 `Reveal` 增加 `initialShown` / `aboveFold` 参数，首页首屏模块默认 shown。

验收：

- 禁用 JS 时内容仍可见。
- 慢速刷新时首屏不会空白。
- `prefers-reduced-motion` 下无位移动画。

### P1：补完 Claude 自己标注的未完成范围

相关文件：

- `CODEX-REVIEW-REQUEST.md`
- `app/app/page.tsx`
- `app/deck/page.tsx`
- `app/research/page.tsx`
- `app/translation/page.tsx`
- `app/logic/page.tsx`
- `app/api/snapshots/route.ts`

必须补齐：

- Reveal 与文字交互不能只落首页，要铺到 `/app`、`/research`、`/translation`、`/logic`、`/deck`。
- `/deck` 要按作品集 tablet 图精修，不要停留在普通数据面板。
- `/api/snapshots` 不能只是假静态样例，至少要有清晰的 `GET` / `POST` 行为和前端调用逻辑；如果不做持久化，必须在代码和 README 中说明是 in-memory demo。
- `/app` 的 3D 必须确认铺满容器，不允许出现 300x150 canvas 或未铺满问题。

### P2：修正文案与真实渲染不一致

相关文件：

- `app/page.tsx`

当前文案：

`Computed by the evolution engine at request time — not a hardcoded value.`

问题：

`next build` 输出 `/` 是 static prerender，并不是 request time。

修复方式二选一：

- 改文案，例如：`Computed by the evolution engine from the current sample state.`
- 或真的把页面改成动态渲染，并解释为什么需要动态。

### P2：重写 README

相关文件：

- `README.md`

当前问题：

- 仍是 create-next-app 默认模板。
- 还写了 `next/font` / Geist，但项目实际不是这样。

重写要求：

- 说明项目定位：Mood Builder 作品集 webapp。
- 说明核心页面：`/app`、`/research`、`/translation`、`/logic`、`/deck`。
- 说明本地运行、测试、构建命令。
- 说明 API 行为。
- 说明已知限制，不要伪装成已完成。

### P3：收敛 3D hack

相关文件：

- `components/three/SpaceScene.tsx`

当前问题：

- `lineBasicMaterial linewidth={2}` 在多数 WebGL 平台会被忽略。
- `window.dispatchEvent(new Event("resize"))` 是全局副作用，不是理想方案。

修复建议：

- 用稳定父容器尺寸、ResizeObserver、R3F invalidate 或 key 重挂载解决 canvas 首测问题。
- 线宽如果必须可控，改用 mesh tube / Line2 / 几何替代，不要依赖 WebGL line width。

## 测试命令

必须在干净安装后运行：

```powershell
$env:Path="C:\Users\Rain\AppData\Local\Programs\nodejs;$env:Path"
cd webapp
npm install
npm run check
```

`npm run check` 必须包含：

- `tsc --noEmit`
- `next build`

如果有 audit warning，需要说明：

```powershell
npm audit
```

## 交付要求

最终交付时请提供：

1. 修改文件列表。
2. 每个 P1/P2/P3 问题的处理结果。
3. `npm run check` 的完整结论。
4. 如果某项没有做，明确说明原因和剩余风险。
5. 不要把 README、handoff、review request 当作完成作品本身；最终页面效果和代码行为才是验收依据。


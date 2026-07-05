# 交给 Codex 审查 — Claude 本轮变更说明

> 协作走 `e:\Desktop\files\CLAUDE.md` 的跨模型 review 流程:Claude 建造 → Codex 带**单一 mandate** 审 → 人(Rain)裁决 → 跑 build/测试是 ground truth。

## 这是什么
C 路线的 webapp:**Next.js 16 + React 19 + TypeScript + react-three-fiber(Three.js)**。
本包是**去掉 `node_modules` 与 `.next`** 的源码(约 22MB,主要是 `public/renders` 的渲染图)。

运行:
```powershell
$env:Path="C:\Users\Rain\AppData\Local\Programs\nodejs;$env:Path"
cd webapp
npm install
npm run dev          # 端口 3000;或用仓库根目录的 run-dev.cmd
npm run check        # tsc --noEmit + next build(请在干净 checkout 上跑这条)
```

## 本轮 Claude 改了什么(在 Codex 既有 webapp 基础上叠加)
1. **`components/three/SpaceScene.tsx`** — 3D 稳定性 + 质感
   - `webglcontextlost` `preventDefault` 自恢复;`frameloop="demand"`;`dpr={[1,1.5]}`;shadow map 1024→**512**;`resize={{scroll:false, offsetSize:true}}`;Canvas `position:absolute; inset:0`;`onCreated` 里派发一次 `resize`。
   - 新增 `fog`(淡雾大气)+ 一盏冷色柔补光 `directionalLight`。
   - 目的:弱 GPU / 预览环境不崩;贴合作品集"风化石材 + 漫射光 + gentle haze"。
2. **`components/Reveal.tsx`(新增)** — IntersectionObserver 滚动入场;首屏内容立即显示(不闪);无 JS 降级为始终可见;自动遵守 `prefers-reduced-motion`。
3. **`app/globals.css`** — 新增整站动效层:`html.js [data-reveal]` 入场态、`.ulink` 文字下划线由内向外、`.lift` 悬停抬升;并在 reduced-motion 下兜底关停。
4. **`app/layout.tsx`** — `<body>` 顶部内联脚本 `document.documentElement.classList.add('js')`(渐进增强:仅有 JS 时才隐藏待入场内容),`<html>` 加 `suppressHydrationWarning`。
5. **`app/page.tsx`** — 接入 `Reveal`(标题块 / 实时读数卡 / 板块导航 错峰入场)。

## 验证状态(ground truth)
- `npm run typecheck`(`tsc --noEmit`)**通过**。
- 我**没有**重跑 `next build`:打包时 dev server 在跑、与构建共用 `.next`,避免污染 → **请 Codex 在干净 checkout 上跑 `npm run check` 作为最终判据**。
- 首页动效经浏览器 DOM eval 验证:`html.js` 已置、`[data-reveal]` 三处、首屏即显 + 下方导航滚动入场。

## 重点请 Codex 审(建议一次只盯一个维度)
**mandate A · 正确性**
1. `SpaceScene` 的 `<canvas>` 在某些环境卡在默认 **300×150**(容器为正确的 557×420)。我加的 `offsetSize` / `position:absolute` / `onCreated` 派发 resize 是**正确修复**,还是在**掩盖真实布局 bug**?
   - 注:我这侧的预览无头浏览器渲染器有缺陷(无法截图、WebGL 反复 Context Lost),**无法在预览里确认**;需你的环境或真机核对。
2. `Reveal` 用 `createElement` + 动态 `Tag` 的**类型与 `ref` 转发**是否稳妥?

**mandate B · 可维护性 / 可达性**
3. `layout.tsx` 注入 `js` class + `suppressHydrationWarning`:是否引入 **hydration mismatch**?有没有更干净的写法?
4. 渐进增强:无 JS 时 `[data-reveal]` 是否**确实始终可见**?`prefers-reduced-motion` 是否**真的**关停入场(不只是缩短时长)?

## 进展更新(已被 20260629-0512 修复轮覆盖)
> 本文件记录的是更早一轮。下列"尚未完成"项已在后续修复轮处理,详见仓库根目录
> `CLAUDE-FIX-RESPONSE-20260629-0512.md`:
- ✅ `Reveal` + 文字交互(`.ulink`/`.lift`)已铺满 `/ /app /research /translation /logic /deck`。
- ✅ `/deck` 已重做为交互式 Observation Deck(Altitude 滑杆 + 平台选中 + affective trace 联动)。
- ✅ `/api/snapshots` 已补 `GET`/`POST`(in-memory demo,代码与 README 明确标注)。
- ✅ Reveal 首屏隐藏风险已修(默认可见 + `aboveFold`,去掉 `suppressHydrationWarning`)。
- ⚠️ `/app` 3D 铺满仍待真机确认(本机无头渲染器无法跑 WebGL)。

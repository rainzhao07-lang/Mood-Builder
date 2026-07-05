# Claude 修复响应 — 对应 CLAUDE-FIX-REQUEST-20260629-0512

针对 `CLAUDE-FIX-REQUEST-20260629-0512.md` 的逐条处理。所有改动在实际代码/页面行为上完成,非文档层面。
最终判据:`npm run check`(`tsc --noEmit` + `next build`)**通过**。

## P1 · Reveal 首屏隐藏风险 — 已修
- 重写 `components/Reveal.tsx`:默认可见;只有客户端挂载后,对**折叠线以下、当前不可见**的模块才加 `data-pending` 隐藏(此时在视口外,隐藏不可见),进视口再入场。新增 `aboveFold` 参数,首屏关键模块永不隐藏。
- `app/globals.css`:从 `html.js [data-reveal]{opacity:0}` 改为 `[data-reveal][data-pending]{opacity:0}`;默认态可见。reduced-motion 下强制可见、无位移。
- `app/layout.tsx`:**移除** body 顶部的 `classList.add('js')` 脚本与 `<html suppressHydrationWarning>`。
- 验收:无 JS → 永不加 `data-pending` → 始终可见;慢 hydration → 首帧即 SSR 可见;`prefers-reduced-motion` → 无位移。

## P1 · 补完未完成范围 — 已补
- **Reveal + 文字交互铺满全站**:`/`、`/app`、`/research`、`/translation`、`/logic`、`/deck` 全部接入 `Reveal`;返回链接用 `.ulink`(下划线动效),卡片用 `.lift`(悬停抬升)。
- **`/deck` 重做为交互式 Observation Deck**:新增 `app/deck/DeckView.tsx` —— **Altitude 滑杆 / 点击平台 / 点击 trace** 三种方式选日,选中平台高亮上浮,右侧标注面板 + 底部 affective trace 联动;数据来自引擎样例,非写死。
- **`/api/snapshots` 真行为**:`app/api/snapshots/route.ts` 现有清晰 `GET`(返回内置 + 本会话 POST 的快照)与 `POST`(校验 body、追加快照、201/400/422),并在代码注释明确标注 **in-memory demo**(重启清空)。`/app` 新增 **Save snapshot** 按钮,真实 `POST` 并回显结果。构建产物中 `/api/snapshots` 已变为 `ƒ (Dynamic)`。
- **`/app` 3D 铺满**:见 P3;移除全局 resize hack,靠稳定父容器 + R3F 测量。

## P2 · 文案与渲染不一致 — 已修
- `app/page.tsx`:`Computed by the evolution engine at request time — not a hardcoded value.` → `Computed by the evolution engine from the current sample state — not a static mock.`(`/` 为 static prerender,新文案准确)。

## P2 · README 重写 — 已完成
- `README.md`:从 create-next-app 模板换成真实文档:项目定位、六个页面、运行/测试/构建命令、API 行为(含 in-memory demo 声明)、技术栈、已知限制。删除错误的 next/font/Geist 描述。

## P3 · 收敛 3D hack — 已完成
- `components/three/SpaceScene.tsx`:
  - 路径线由 `<line><lineBasicMaterial linewidth={2}/>`(多数平台忽略 linewidth)改为 **drei `<Line lineWidth={2}>`**(底层 Line2/LineMaterial,像素级线宽稳定生效)。
  - **移除** `onCreated` 中的 `window.dispatchEvent(new Event("resize"))` 全局副作用;保留 `resize.offsetSize`,依赖稳定的 `position:absolute; inset:0` 父容器 + R3F 自带 ResizeObserver。

## 测试结果(ground truth)
```
npm install            # OK(2 moderate audit warning,见下)
npm run check          # tsc --noEmit ✓  +  next build ✓ 编译成功
```
路由:`/ /app /deck /logic /research /translation` 静态;`/api/snapshots` 动态(ƒ)。

## 剩余风险
1. **3D 真机确认**:`/app` 的 canvas 铺满已用稳定父容器 + offsetSize 保证;但本机的预览/无头渲染器无法跑 WebGL,我无法在此截图确认,需在正常 Chrome 核对(代码结构正确,300×150 是无头环境产物)。
2. **持久化**:`/api/snapshots` 是 in-memory demo,重启清空;已在代码与 README 标注。要真后端需换 JSON/SQLite。
3. **npm audit(2 moderate)**:`postcss <8.5.10` 的 CSS stringify XSS,是 **Next 16 自带传递依赖**;`npm audit fix --force` 会把 next 降到 9.3.3(毁灭性破坏),故**不修**,作为已知可接受风险。非本轮改动引入。
4. **范围**:14 屏手机流程仍以 `/logic` 的 build order 形式记录,实时 app 实现核心 record→generate 闭环,未逐屏实现全部 14 屏。

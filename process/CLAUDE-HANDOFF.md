# Claude Handoff - Mood Builder Design System

## 当前结论

Codex 已把 Claude Code 之前留下的 Web 侧缺口补到一个可验证节点,并对 Figma 手机屏做了一轮高杠杆母版修正。当前交付不是最终完成版,但已经从“只有首页 + 一个 `/app` 页面”推进到“作品集入口完整 + 快照 API + Figma 样式母版已初步校正”。

## 环境

- 系统: Windows / PowerShell
- 项目根目录: `E:\Desktop\Mood Builder Design System`
- Web 项目目录: `E:\Desktop\Mood Builder Design System\webapp`
- Node 便携路径: `C:\Users\Rain\AppData\Local\Programs\nodejs`
- Figma 文件: `https://www.figma.com/design/v1xmYsiTyLpLJ3cx5n0KVy/Untitled?node-id=12-716&t=0JYqEmmfbYHviSpU-1`

运行验证命令:

```powershell
$nodeDir='C:\Users\Rain\AppData\Local\Programs\nodejs'
$env:Path="$nodeDir;$env:Path"
$env:NEXT_TELEMETRY_DISABLED='1'
Set-Location 'E:\Desktop\Mood Builder Design System\webapp'
npm run check
```

最近一次结果: 通过。`tsc --noEmit` 通过,`next build` 通过。

构建路由已包含:

- `/`
- `/app`
- `/api/snapshots`
- `/research`
- `/translation`
- `/logic`
- `/deck`

## Web 侧已完成

新增/修改重点:

- `webapp/lib/portfolio/content.ts`
  - 新增作品集共享内容层。
  - 生成 14 天 `DAILY_PLATFORMS` 样例快照。
  - 暴露 `PHONE_SCREEN_FLOW`, `RESEARCH_THREADS`, `EMOTION_SUMMARY`, `LOGIC_MIX`。
- `webapp/app/api/snapshots/route.ts`
  - 新增快照 API。
  - 返回 `{ latest, snapshots }`。
- `webapp/app/research/page.tsx`
  - 补 Global Research 作品集页。
- `webapp/app/translation/page.tsx`
  - 补 Translation Database 页。
- `webapp/app/logic/page.tsx`
  - 补 Logic Diagram 页,并列出 14 屏手机流程。
- `webapp/app/deck/page.tsx`
  - 补 Observation Deck 页。
- `webapp/app/boards.module.css`
  - 新增作品集板通用样式。
- `webapp/components/EmotionWheel.tsx`
  - 加 keyboard 操作和 ARIA。
- `webapp/app/app/page.tsx`
  - slider label 加 `htmlFor/id` 绑定。
- `webapp/package.json`
  - 新增 `typecheck` 和 `check` 脚本。

## Figma 侧已完成

在 Figma 桌面版中已实际修改:

- `01 · UI System` 页的 `ScreenTitle` 母版:
  - `Title 1` / `Title 2`: Fraunces Regular, 24px, line-height 27px, letter spacing -1%。
  - `Description`: Hanken Grotesk Regular, 13.5px, line-height 22px。
  - `Eyebrow`: Hanken Grotesk Bold, 11px, line-height 14px, letter spacing 14%。
- `MB/Action/Button` 的 `Primary / Light` 变体:
  - 按钮从深色实心改为纸色描边方向。
  - label 改为 Fraunces Regular 15px, line-height 20px。
  - label fill 改为 `#2F3E42`。
- 回到 `02 · iPhone 17 Pro Max Screens` 验证:
  - 标题样式已传导到手机屏。
  - 底部主按钮已从深色实心传导为描边/纸色形态,文字恢复可见。

详细记录在:

- `E:\Desktop\Mood Builder Design System\FIGMA-REVIEW-NOTES.md`

## 重要判断

当前 Figma 的核心结构问题不是单个字号,而是画板基准:

- Codex 把 14 屏做在 `iPhone 17 Pro Max` 宽画板上。
- 原设计系统 token 是按 `340 × 710` 手机宽度校准。
- 所以视觉上会天然出现“字号偏小、留白偏空、组件密度不对”。

不要靠单纯放大字号解决这个问题。正确路线是:

1. 先决定是否把画板回到 `340 × 710`。
2. 再重排密度。
3. 再逐屏重连 text styles 和组件。

## 剩余优先级

### P0 - Figma 14 屏真实修完

1. 画板尺寸策略:
   - 推荐回到 `340 × 710`。
   - 如果坚持 Pro Max 画板,必须按比例重建字阶和间距,不能套 340 token。
2. 逐屏检查游离文本:
   - Hero 标题。
   - Newsreader italic note。
   - Caption/meta。
   - 任何没有套 `ScreenTitle` 母版的标题。
3. 按钮:
   - `Primary / Light` 的 stroke 需要确认是否真为 `#2F3E42`。Codex 操作时 Figma 色板不稳定,可能仍显示黑色。
   - 主按钮必须是描边 serif pill,不是实心 slate rect。
4. Observation Deck:
   - 这是作品集视觉记忆点,需要最高优先级精修。
   - 要强化 platform stack / altitude slider / affective trace。
5. Immersive:
   - 可以使用深色背景,但控件必须保持轻、安静,不要做成游戏 HUD。

### P1 - Web 侧继续补闭环

1. `/app` 仍是一个大交互界面,不是 14 个手机屏流程。
2. 如果 Web 也要贴合 Figma,应新增 `/mobile` 或 `/screens`:
   - 用 14 个 phone frame 按 Figma 流程串联。
   - 复用 `PHONE_SCREEN_FLOW`。
3. API 目前是静态样例数据,没有真实写入。
   - 若要真后端,下一步做 `POST /api/snapshots`。
   - 持久化可先用 JSON file 或 SQLite,不要过早上复杂数据库。

### P2 - 自动化测试

当前只有:

- `npm run typecheck`
- `npm run build`

建议下一步加:

- engine 单元测试。
- API snapshot contract 测试。
- Playwright 截图测试,至少检查:
  - `/`
  - `/app`
  - `/translation`
  - `/deck`
  - canvas 非空。

## 需要避免的误判

- PowerShell `Get-Content` 偶尔把 UTF-8 中文显示成乱码,但 `rg` 读到的文件内容是正常的。不要因为终端显示乱码就盲目重写文件。
- 工作区不是 git repo,不能依赖 `git diff` 判断修改范围。
- Figma MCP 曾经被 Starter 限流;实际修改通过 computer use 完成。
- Figma 当前有 3 页:
  - `01 · Component Library` 基本空。
  - `01 · UI System` 才是真正的 foundation/component 页。
  - `02 · iPhone 17 Pro Max Screens` 是 14 屏页面。

## 建议 Claude 下一步

先不要继续扩 Web 功能。下一步应该集中处理 Figma:

1. 复制当前 Figma 文件或至少确保可回退。
2. 选择画板策略:推荐 `340 × 710`。
3. 按 `FIGMA-REVIEW-NOTES.md` 的顺序继续修。
4. 每修完一类母版,回 `02 · iPhone 17 Pro Max Screens` 验证传导。
5. 最后逐屏做一次验收截图。


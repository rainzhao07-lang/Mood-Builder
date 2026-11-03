# Mood Builder — Figma 搭建逻辑(14 屏完整流程)

> 目标:让 Figma 里的 14 个手机屏 **1:1 还原设计系统与作品集**。
> 核心纪律:**所有数值不手填,先建 styles / variables,再拼屏。**
> 字号、颜色、间距全部对齐 `tokens/*.css`(本仓库即唯一信源)。

---

## 0. 先纠根因:画板尺寸必须是 340 × 710

设计系统的字阶/间距是按 **340 宽设备**校准的(`--phone-width: 340px`、`--phone-height: 710px`)。
- 正文 13.5px、标题 24px、留白 22px 这些值,**只有在 340 宽画板上才是对的比例**。
- 若画板用了 390 / 412 / 430(标准机型),同样的 token 字号会显得**偏小、发空**——这正是当前 Figma 版"字号不对"的来源。

**所以每个屏幕 frame = 340 × 710**(圆角 46 给设备外壳那层;内容画板可不切角)。
状态栏 42、底部 footer 84(`--statusbar-height` / `--footer-height`)。

> 如果一定要用大机型画板,必须把整套字阶按比例放大(×画板宽/340),否则就会重蹈覆辙。**推荐直接 340。**

---

## 1. 文件结构与搭建顺序

四个 Page,严格自下而上:

1. **① Foundations** — Color styles + Text styles + 间距/圆角说明卡
2. **② Components** — 所有可复用组件(按钮、卡片、情绪轮…)
3. **③ Screens** — 14 个屏幕(只允许拖 ② 里的组件 + ① 的样式)
4. **④ Flow** — 原型连线(屏间跳转 + 转场)

顺序就是 **token → styles → components → screens → prototype**。跳步必乱。

---

## 2. Color Styles（照搬 `tokens/colors.css`）

建成 Figma color styles,命名建议用 `斜杠分组`:

**Base / Slate**
- `base/slate-900` #1c2629 · `slate-800` #242f32 · `slate-700` #2f3e42(主交互色)· `slate-500` #5e6d6f · `slate-400` #768383 · `slate-300` #9aa6a5

**Base / Sage·Mist·Band**
- `base/sage-600` #74897f · `sage-500` #8fa39a · `sage-300` #aebfb7 · `mist-500` #9fb2b3 · `band-500` #aebfca · `band-300` #c6d2da

**Base / Paper·Panel**
- `base/paper-000` #ffffff · `paper-100` #f4f5f2(屏背景)· `paper-200` #eef1ee · `panel-300` #dde4e2(卡片)· `panel-400` #cdd8d5 · `panel-500` #d7dcd8(app 桌面)· `line-300` #c2cdca · `line-200` #d3dbd8

**Base / Gold（仅进度/阶段用）**
- `base/gold-600` #a3854f · `gold-500` #bb9a62 · `gold-300` #d4bd92

**Status（去饱和、近临床）**
- `signal/rest` #8fa39a · `signal/warn` #bb9a62 · `signal/alert` #a3705f（柔黏土红,永不刺眼)

**语义别名（实际拼屏只用这层,别直接用 base):**
text/strong=slate-700 · text/body=slate-500 · text/muted=slate-400 · text/inverse=paper-200 · text/accent=sage-500 · surface/app=panel-500 · surface/screen=paper-100 · surface/card=panel-300 · surface/card-deep=panel-400 · surface/immersive=slate-900 · interactive=slate-700 · on-interactive=paper-200 · accent/progress=gold-500

---

## 3. Text Styles（照搬 `tokens/typography.css`）——重点

三套字族(都在 Google Fonts,Figma 直接启用):
- **Display / 标题 / 按钮 / 指标数值 = Fraunces**(weight 500,字间距 −0.01em,opsz 偏高;可选 italic)
- **正文 / UI / 状态 = Hanken Grotesk**(300–700)
- **斜体编辑型说明 = Newsreader**(italic)

建成 text styles(名 / 字族 / 字号 / 行高 / 字重 / 字距):

| Style 名 | 字族 | 字号 | 行高 | 字重 | 字距 | 用途 |
|---|---|---|---|---|---|---|
| `display/hero` | Fraunces | 30 | 1.12 | 500 | −0.01em | app 标题 / wordmark |
| `display/immersive` | Fraunces | 25 | 1.12 | 500 | −0.01em | 沉浸标题 |
| `display/title` | Fraunces | 24 | 1.12 | 500 | −0.01em | **屏标题(最常用)** |
| `display/title-sm` | Fraunces | 22 | 1.12 | 500 | −0.01em | 紧凑标题 |
| `metric/lg` | Fraunces | 22 | 1.2 | 500 | −0.01em | 指标数值(0.62 等) |
| `metric/md` | Fraunces | 20 | 1.2 | 500 | −0.01em | 次级数值 |
| `body/lede` | Hanken | 15 | 1.6 | 400 | 0 | 引导句 / 按钮文字 |
| `body/md` | Hanken | 13.5 | 1.6 | 400 | 0 | **默认正文** |
| `body/sm` | Hanken | 13 | 1.6 | 400 | 0 | 次要正文 |
| `caption/xs` | Hanken | 12 | 1.4 | 500 | 0 | 说明 |
| `eyebrow` | Hanken | 11 | 1.2 | 700 | 0.14em | 全大写小标题(SELF-REPORT) |
| `meta/caps` | Hanken | 11 | 1.2 | 600 | 0.08em | 大写元信息(PHASE / STAGE 2/5) |
| `micro` | Hanken | 10 | 1.2 | 600 | 0.06em | 微标签 |
| `note/italic` | Newsreader | 14 | 1.5 | 500 *italic* | 0 | **斜体编辑说明(签名级特征)** |

> Codex 那版"字号不对",优先核这三处:① 标题是否 Fraunces 24 而不是某个 sans;② 正文是否 13.5 而不是 14/16;③ 斜体说明是否用了 **Newsreader italic**(这是作品集的标志性细节,极易被漏掉)。

---

## 4. 间距 / 圆角 / 阴影（`spacing.css` + `radius.css`）

- **间距阶(4px base):** 2 · 4 · 6 · 8 · 12 · 14 · 16 · 18 · **22(屏左右留白)** · 26 · 34 · 46。卡内边距 16,卡间距 12,表单字段间距 18。建成 Figma variables 用于 auto-layout 的 gap/padding。
- **圆角:** tile 14 · 卡片/按钮/输入 16 · pill 999 · 设备外壳 46 · 大圆角 36。**全程无尖角。**
- **阴影:** `shadow-card` = `0 2px 12px -4px rgba(47,62,66,.14)`(弥散、冷、低对比);`shadow-pop` = `0 8px 24px -10px rgba(47,62,66,.26)`;设备外壳 `0 30px 60px -20px rgba(30,45,48,.45)`。**卡片不靠描边,靠 paper→panel 的色阶台阶分层。**

---

## 5. 屏幕骨架(每屏统一)

用 **Auto Layout** 竖排,frame 340×710:
```
[topline]  ← 高度 ~44:左 ‹ Back / 中 屏标题(display/title-sm 16) / 右 元信息(meta/caps)
[body]     ← flex 撑满,左右留白 22,可滚动;标准头部堆叠:eyebrow → 标题 → lede
[footer]   ← 高 84,单个全宽主按钮(必要时上方加一个次级 filled pill)
```

---

## 6. 组件库（先建,再拼屏——这步偷懒后面全乱）

| 组件 | 规格(对齐设计系统) |
|---|---|
| **Button / primary** | 全宽 **描边 pill**:边框 1px `interactive`,内填 `paper-100`,文字 **Fraunces 15(`body/lede` 改 Fraunces)**,圆角 999,高 ~48,padding 13×22。**hover 填满 slate、文字转 `on-interactive`**。注意:**不是实心 slate 方块**。 |
| **Button / secondary** | 实心 **panel pill**(填 `surface-raised`、无边框、`shadow-sm`),位于主按钮**上方**(如 Activate Interaction / Save to Archive)。 |
| **Card** | 填 `surface-card` #dde4e2,圆角 16,padding 16,**无描边**,`shadow-card`。深一档用 `surface-card-deep`。 |
| **MetricStat** | 卡内:`eyebrow` 标签 + **Fraunces 22 数值** + 小写单位(Hanken)。例:Emotion State / **Calm** / 0.62。 |
| **Energy·Pleasantness Field** | 148 高渐变面板(135° `#cdd8d5→#bcc9c6`),圆角 16,四角放 9px 标签,内有 13px slate 圆点 + `ring-dot` 光环。 |
| **StageBar** | "Stage 2 / 5",分段轨;**当前进度用 gold**(gold 只在这类进度出现)。 |
| **ProgressBar** | 细轨 + gold 填充。 |
| **SignalRow** | 左标签 + 右值 + **状态点(6px 色点)+ 词**:`● Stable`(rest)/`● Tracking`/`● Detected`(warn/alert)。 |
| **Chip / filter** | pill,选中=填 `interactive`+`on-interactive`;未选=`surface-raised`+`border-soft`。 |
| **Slider** | 4px 轨 + 16 圆 thumb(填 interactive、2px paper 描边、`ring-dot`)。 |
| **EmotionWheel** | 圆盘,**6 根轴**:上 CONFIDENT,顺时针 CALM / SCARED / SAD / MAD / JOYFUL;同心环 + 散点 + 可拖中心落点(13px slate 点)。标签 Hanken 9 全大写 0.08em。 |
| **SpaceTile** | 圆角 14 满铺图片瓦片(放等距空间渲染)。 |
| **PhoneFrame** | 设备外壳:圆角 46,深阴影,顶部刘海 + 状态栏 42。 |
| **Status dot** | 6px 圆,色取 `signal/*`,后接一个词,绝不用 emoji。 |

> 全部做成 **Figma Component + Variants**(按钮 state、chip on/off、signal rest/warn/alert),屏幕里只放实例。

---

## 7. 逐屏拆解(14 屏 · 内容取自 `ui_kits/mood-builder-app/SCREEN-SPEC.md`)

每屏 = 骨架(§5)+ 组件(§6)+ 文字样式(§3)。括号内是关键组件/样式。

1. **Observe** — 居中:wordmark(display/hero,*Builder* 用 sage italic)+ 标题"A system that translates / emotional states into / evolving spaces."(display/title 居中)+ note "Each day you record how you feel. The space remembers, and grows." → 主按钮 **Observe**。
2. **Home / Phase** — topline 右 `Day 14 / Week 3`;eyebrow `PHASE`;Card(MetricStat:Emotion State / Calm / 0.62 + note"Estimated from subjective and physiological input.")+ **Energy/Pleasantness Field**(dot 左38%/上44%)+ 卡(Stage 2/5 · Spatial State · note"Spatial system evolving" · ProgressBar · "Next stage in 3 days")→ 主按钮 **Record Today** + hint。
3. **Subjective** — topline 右 note"Log emotional and physiological signals";**EmotionWheel**;note"Place where it feels most accurate to you";**Subjective input captured**(note/italic 加粗)+ "System calibration in progress" → 主按钮 **Continue**。
4. **Calibrate** — 标题"Physiological signals detected / Used to calibrate emotional state";三条 **SignalRow**:Heart Rate Variability `72 ms` `● Stable` / Skin Conductance `Low fluctuation` `● Tracking` / Motion `Minimal` `● Detected` → 主按钮 **Continue**。
5. **Generate** — topline 右 `Space Generated`;**SpaceTile**(等距空间)+ note"Space now feels more serene and open due to Calm state";次级 pill **Activate Interaction** + "…50% complete" → 主按钮 **Next**。
6. **Adjust** — 标题 `Space Adjustment`;四个 **Slider**:Element Density / Color Tone / Lighting Intensity / Layout Style → 主按钮 **Next**。
7. **Temporal Layer** — topline ‹Back · 右 `Stage 2/5`;note"Time-gated snapshots…";SpaceTile(Current Snapshot · `Captured · Day 14 · 09:41` · `Calm · 0.62` · "Drag to rotate · Pinch to zoom")+ Time Gate Slider(Past→Now)+ `Lighting −8%` + Day 11…Day 14 → 主按钮 **View Insights**。
8. **Insights** — topline `Insights · Calm · 0.62 · ⋯`;**Key Changes**(三条 delta 行:Lighting −8% / Element Density +12% / Layout More linear,各带斜体说明)+ **Drivers**(splitbar:Objective 55% / Subjective 45%)+ **Archive** chips(Day 3/7/11/14)→ 主按钮 **Save Snapshot**。
9. **Archive** — `Archive · ⋯` + "Last 14 days · 14 snapshots";filter **Chip** 行(All / By Stage / By Emotion / By Change);两张快照卡(Day 14 Calm 0.62 / Day 11 Scared 0.58,各带 delta)→ 主按钮 **Compare selected**。
10. **Compare** — `Compare · ⋯`;A/B 两行(Day 11 Scared 0.58 / Day 14 Calm 0.62);**Before/After 拖动对比**(两张图 + 手柄 `⇄`);次级 pill **Back to Archive** → 主按钮 **Open Timeline**。
11. **Timeline** — `Timeline · ⋯ · Stage 2/5`;SpaceTile(Selected Snapshot 3D)+ **Emotion Trend**(`Δ +0.04` `Range 0.48–0.62`)+ 两张快照卡 → 主按钮 **Compare Selected**。
12. **Snapshot Detail** — `Snapshot Detail · ⋯`;SpaceTile;**What changed**(Lighting +8% / Element Density / Layout More linear)+ **Drivers**(Objective 55% / Subjective 45%);次级 pill **Save to Archive** → 主按钮 **Export Summary**。
13. **Variants** — `Variants · ⋯`;SpaceTile(Selected Variant)+ **Quick Differences**(Element Density / Lighting 三套对比:Calm/Scared/Sad)+ note"rule-constrained from your current emotion vector";次级 pill **Compare Variants** → 主按钮 **Choose Variant**。
14. **Immersive** — **满铺第一人称室内照**(immersive-ruins),仅左上 ‹Back 浮层 + 底部渐隐遮罩 + 沉浸标题(display/immersive)+ 小字说明。footer 区域用 `surface-immersive` 深色。

---

## 8. 原型连线（④ Flow Page）

主线(主按钮跳转,转场 = Smart animate / Dissolve,**0.42s,ease `cubic-bezier(.22,.61,.36,1)`**,呼应 `--dur-slow`/`--ease-settle`):
`Observe → Home → Subjective → Calibrate → Generate → Adjust → Temporal → Insights → Archive → Compare → Timeline → Snapshot → Variants → Immersive`
返回:各屏 ‹Back 回上一屏;Immersive 的 ‹Back 回 Generate/Temporal。

---

## 9. 字体准备

Figma 内启用:**Fraunces**(含 Italic)、**Hanken Grotesk**、**Newsreader**(含 Italic)。Geist / Geist Mono 备选(密集数字)。
若团队字体库没有,Admin 在 Figma 里 Enable Google Fonts 即可。

---

## 验收清单(逐项核对 Codex 那版)

- [ ] 画板 **340×710**(不是 390/412/430)
- [ ] 标题 = **Fraunces 24/500/−0.01em**,正文 = **Hanken 13.5**
- [ ] 斜体说明用 **Newsreader italic**(没用就是错)
- [ ] 主按钮 = **描边 serif pill**,不是实心方块
- [ ] 卡片 **无描边**,靠 paper→panel 色阶分层 + `shadow-card`
- [ ] gold 只出现在 **进度/阶段**,不当按钮/大色块
- [ ] 情绪轮 6 轴顺序:CONFIDENT/CALM/SCARED/SAD/MAD/JOYFUL
- [ ] 留白:屏左右 **22**,卡内 16,卡间 12
- [ ] 无 emoji;状态用 **色点 + 词**

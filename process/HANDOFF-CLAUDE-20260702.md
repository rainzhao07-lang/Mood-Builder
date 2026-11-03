# Mood Builder — Claude 交接 / 思路 / Codex 纠错 / 路线图

> 日期 2026-07-02。作者:Claude(Opus 4.8)。用途:把本轮所有决策、Codex(GPT)改错的地方、以及后续深化思路一次交清,任何人/任何 agent 可据此接手。**仓库是唯一信源;这份是导航图。**

---

## 0. 现在的状态(TL;DR)

- 产品已从"作品集网页"**转为真做的手机 App**(iOS 风,`/app`),核心是"记录心情 → 生成一座可交互的三维空间"。
- 技术栈:**Next.js 16 + React 19 + TypeScript(strict)+ Three.js / R3F / drei / @react-three/postprocessing**。
- 运行:`cd webapp && npm ci && npm run check`(= `tsc --noEmit` + `next build`)。**交接时 tsc + build 全绿,`/app` 200。**
- Node:用户用便携版 `C:\Users\Rain\AppData\Local\Programs\nodejs`;任何 Node 20+ 都行。
- 本机 dev:`npm run dev` → http://localhost:3000/app(会话重启会杀掉后台进程)。
- **WebGL 无法用无头预览验证**(本机预览 MCP 渲染器有缺陷),视觉一律靠真机 Chrome 目检 + tsc/build。

---

## 1. 产品是什么(愿景,别跑偏)

心理问题普遍却难自察。用"**记录心情 → 生成空间**"把抽象情绪具象化,让人看见并确认自己的状态。
- **双输入**:① 生理(模拟可穿戴:HRV/静息心率/皮电/体动,可扩展呼吸/血氧/睡眠/语音韵律…);② 用户(情绪轮点选 / 文字描述→本地启发式判情绪,**文字识别未做**)。
- **时间模型**:`一次记录 CheckIn → 当日 DaySpace → 周平台 WeekPlatform(7 天融合)`;一屏 **≤7 个平台**;可下钻回看每天。
- **手机端**:iOS 交互规范 + 作品集配色(hybrid)。

---

## 2. 文件地图(只看 `webapp/`)

```
app/app/                     iOS 外壳 + 底部 4 Tab
  layout.tsx / TabBar.tsx    手机框(iPhone 17 Pro 402×874)、灵动岛、Liquid Glass 悬浮标签栏、Home 条
  page.tsx (Today)           情绪轮 + 生理滑杆 → 引擎读数 → SpaceViewer(真 3D)→ 存 localStorage
  deck/ insights/ studio/    时间堆叠 / 趋势 / 自定义(后两块含 Soon 脚手架)
  shell.module.css           外壳样式(共享 card/row/empty)
lib/engine/                  ★项目 IP★
  translation-db.ts          每种情绪 → 建筑词汇(风格/材料/植被/光/声/天气 + 数值锚点)
  evolution-engine.ts        双流融合 fuse + 锐化映射 toSpaceParameters
  composer.ts                空间参数 → 可渲染几何(体量/植被/流线)+ 参数兜底 sanitize
  weather.ts                 energy/pleasant → 天气模式 + 标签
lib/app/                     App 数据层
  types.ts                   CheckIn / DaySpace / WeekPlatform
  store.ts                   localStorage CRUD + 按日/周聚合 + volatility
  asset-manifest.ts          分层渲染图合成器(LIBRARY_READY=false,占位用现有 3 张 iso 图)
components/three/
  SpaceScene.tsx             写实实时 3D 世界(SceneContents 导出复用)
  SpaceViewer.tsx            Today 用:Rotate/Walk 双模式 + 后期 + 全屏 + 情绪色彩分级
public/renders/              真渲染图(space-iso-*.png 等);library/ 待用户导出分层图库
```

根目录另有旧设计系统资料(assets/tokens/ui_kits/…)与历史文档,审代码时**忽略,只看 webapp/**。

---

## 3. 引擎:情绪如何变成空间(关键机制)

1. `vectorFromWheel(angle, radius)`:情绪轮落点 → 六维情绪向量(radius 越大越尖锐)。
2. `fuse(主观, 生理)`:双流加权融合(客观基权 0.55,体动大则让权主观)→ 得 dominant/score/energy/pleasantness/confidence。
3. `toSpaceParameters(reading)`:**这里决定"跨度"**。
   - 先 `sharpen(vector, 3)` 把权重按 3 次幂锐化 → 主导情绪主宰参数(**否则六情绪被软平均、长得都一样**)。
   - 再 `contrast01(x, k)` 把 verticality/complexity/density/lightIntensity 向两端拉。
   - 输出 SpaceParameters(含 architectureStyle、material、verticality、massingComplexity、vegetationDensity、lightWarmth、weatherMode…)。
4. `composeSpace(params, seed)`:确定性随机生成几何。heightScale `0.3 + verticality*4.8`;scared 拔尖塔、sad 压平板、mad 剧烈旋转碰撞、有序情绪近正交。

**情绪锚点(translation-db,已推到极端)**:sad verticality 0.06 / confident 0.86 / scared 1.0 / mad complexity 1.0 / calm complexity 0.05。**别把这些改回中庸,别把 toSpaceParameters 的 sharpen 去掉**——那会让跨度重新变小。

---

## 4. 三维渲染系统(SpaceScene / SpaceViewer)

- **配色完全写实、自由,不带 App 的 teal**:暖石/木/玻璃/金属 + 绿植/樱花 + 蓝天/草地/**反射水面** + 彩色人物。窗户暖光发光。
- **六情绪建筑风格**:古典柱廊+**三角山花**(confident)、拜占庭穹顶(calm)、Art Deco 退台(joyful)、哥特尖塔(scared)、**厚重悬挑平屋顶**(sad)、解构倾斜碰撞(mad)。
- **光照/氛围**:drei `Sky` 真天空 + `Environment`(Lightformer 棚拍,无 CDN)+ `SoftShadows` + 暖/冷主光随情绪。
- **后期**(`SpaceViewer` 的 `Effects`):Bloom 辉光 + **HueSaturation 情绪色彩分级(积极鲜艳、消极→灰,sad sat≈-0.95)** + BrightnessContrast + Vignette;**景深 DOF 仅 Walk(透视相机)开**。
- **交互**:Rotate(等距 OrbitControls)/ Walk(第一人称:拖动看向 + 虚拟摇杆)/ **全屏按钮**(左上 ⛶)。
- **画质**:用户明确"别管性能、要真实"→ **`quality` 恒为 `"full"`、`frameloop="always"`**(见下 Codex 纠错)。

---

## 5. ★Codex(GPT)改错了什么★

Codex 跨十几个文件做了一轮"防御性/性能"重构。**大部分是好的,但两处把默认体验改坏了,已由我修回:**

### ❌ 错误 1:`frameloop="demand"`(黑屏/卡死风险)
`SpaceViewer` 里把晴天 orbit 视图设成 `frameloop={... "demand" : "always"}`。**demand 帧循环 + @react-three/postprocessing + MeshReflectorMaterial/Environment 是经典黑屏/卡住组合**(合成器不按需重绘)。
→ **已修:`frameloop="always"`**。

### ❌ 错误 2:默认视图降到 `preview` 画质档(画面变平变空)
Codex 加了 `SceneQuality = "preview" | "full"`,默认 orbit 用 `preview`,于是:**关掉了投影阴影(`shadows={quality==='full'}`)、关掉反射水面、稀疏植被/人物、砍 Bloom/Vignette、禁 DOF、降 dpr**。这直接违背用户"别管性能、要真实"的要求,画面比上一版明显退化。
→ **已修:`const quality: SceneQuality = "full";`(恒全质量)**。`SceneQuality` 机制保留(以后若真要做手机低配档可复用),但默认不许降级。

> ⚠️ 给下一个接手者(尤其 Codex):**不要再为性能牺牲默认画质,也不要用 demand 帧循环。** 用户台机是 NVIDIA,明确不在乎性能。

### ✅ Codex 做对、我保留的
- `sanitizeSpaceParameters()`:对非法/NaN 空间参数兜底(健壮性,好)。
- `weatherMode` 收进引擎(`toSpaceParameters` 里 `weatherFromReading`),Today 用 `params.weatherMode`,不再自己算(干净)。
- `finiteNumber()` 全面防 NaN;`CheckIn` 存 `seed`(可复现);Today 的 setTimeout 清理(防泄漏)。
- **未破坏**上一轮的情绪锐化与极端锚点(我已核对)。

---

## 6. 我的后续深化思路(按优先级)

### A. 画质/真实感(实时 3D 天花板内)
1. **树冠/樱花做厚**:blossom 花团数 15→~24、加 2–3 根分枝;pine 冠层更密、trunk taper。
2. **地面真实化**:草地加土路/裸土斑块 + 草色噪声变化;边缘石不要纯灰。
3. **尺度细节**:窗加窗框、加门、加台阶扶手 → 第一人称走近更可信。
4. **DOF/氛围微调**:Walk 景深焦距按到最近建筑;晨昏体积光(需 God-rays,postprocessing 有)。

### B. 情绪跨度/风格(已很大,可继续)
5. 每情绪**专属地面处理**(sad 裂缝/积水、joyful 花田、mad 碎裂铺装)。
6. roofForm 再细分(mad 的"折叠碰撞平面"目前靠倾斜,可做真折板屋顶)。

### C. 画质天花板(需用户出资源)
7. **Rhino → GLB**:用户每种情绪(或情绪×强度)在 Rhino 导 **`.glb`**(不是 .3dm!),我用 `GLTFLoader` 按情绪加载真模型 → 画质最高、可旋转可第一人称。这是超越程序化的唯一路。
8. **分层渲染图库**:若走静态 display 路线,用户按根目录 `RENDER-ASSET-SPEC.md` 导 ~20 张分层透明 PNG 进 `public/renders/library/`,把 `asset-manifest.ts` 的 `LIBRARY_READY` 翻 `true` 即全站换真图。

### D. 功能补全(不依赖资源)
9. **文字→情绪本地启发式** `heuristic-nlp.ts`(关键词/情感词典 → 六维向量),接到 Today 的文字输入。
10. **周融合视图**:`fuseWeek(7×DaySpace)` + Deck 下钻。
11. **Studio 四块真编辑**:情绪类别 / 空间外观 / 追踪信号 / 映射规则。
12. **Insights** 趋势:波动曲线、反复模式检测。

---

## 7. 运行 / 验证 / 交付

```powershell
cd "E:\Desktop\Mood Builder Design System\webapp"
npm ci            # 或 npm install
npm run check     # tsc + build,应全绿
npm run dev       # http://localhost:3000/app
```

- **已生成交付压缩包**:`E:\Desktop\MoodBuilder-for-codex-20260701.zip`(64MB,含整份源码,已排除 node_modules/.next)。
- **GitHub 推送**:项目还不是 git 仓库。要推:`git init` → 根目录补 `.gitignore`(排除 node_modules/.next/.log/`_review_claude_*`)→ `git add .` → commit → 建私库 push。(上次卡在环境命令分类器临时不可用,非失败,可重试。)
- **给审查者的话**:只看 `webapp/`;已知 WIP(别当 bug):渲染图库占位、文字 AI 未做、周融合/自定义为脚手架、桌面板页 `/research /translation /logic /deck` 是旧概念页。

---

## 8. 硬约束 / 红线(务必守)

1. **配色 hybrid**:teal 只用于 App **UI 外壳**(导航/卡片/图表);**3D 空间内部配色完全写实自由,绝不能改回 teal**。
2. **运行零外部 CDN**:字体自托管;不要引会在运行时抓 CDN 的依赖(如 drei `Environment` 的 HDR preset)。
3. **引擎是唯一数据源**:空间一切从 `composeSpace` 出;`translation-db` 是 IP,改词汇要谨慎。
4. **别为性能降默认画质、别用 demand 帧循环**(见第 5 节)。
5. **localStorage 持久化**,零后端,大陆可直接用。

---

## 9. 记忆锚点(Claude 的持久记忆里已存)

`project-overview` / `webapp-rebuild` / `color-realism-pivot` / `product-rebuild` —— 记录了项目定位、重建起因、配色/真实感转向、手机 App 方向与本轮 3D 决策。接手 Claude 会自动加载。

— 完 —

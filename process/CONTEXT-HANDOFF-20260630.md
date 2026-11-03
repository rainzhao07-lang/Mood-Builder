# Mood Builder webapp — 上下文接续文档（2026-06-30）

> 用途：新会话直接读这一份就能接着干，不依赖任何对话记忆。仓库是唯一信源。
> 项目根：`E:\Desktop\Mood Builder Design System`　Web 工程：`E:\Desktop\Mood Builder Design System\webapp`

---

## 0. 一句话项目定位

Mood Builder 是一份学术建筑作品集的**交互式 Web 伴随版**：把"情绪"翻译成可生长的等距 3D 空间。
主观（情绪轮）+ 客观（生理信号 HRV/皮电/运动）→ 引擎融合成情绪向量 → 映射成空间参数 → 程序化生成一座 3D 空间；每天一个空间，堆叠成时间记录（观景台）。
作品集里写死的数字/形态，这里都由引擎实时算。**目标是作品集级交互视觉，不是普通 SaaS 页面。**

技术栈：**Next.js 16 + React + TypeScript + Three.js（@react-three/fiber / @react-three/drei）**，样式用 CSS Modules + `app/globals.css`。

---

## 1. 怎么跑 / 怎么验证（照抄）

Node 是**便携版**，先注入 PATH：

```powershell
$env:Path="C:\Users\Rain\AppData\Local\Programs\nodejs;$env:Path"
cd "E:\Desktop\Mood Builder Design System\webapp"
npm install
npm run dev        # http://localhost:3000
npm run check      # tsc --noEmit + next build —— 最终判据，必须 GREEN
```

- 当前状态（2026-06-30）：**`npm run check` 通过（GREEN）**，全 7 条路由编译成功。
- 路由：`/`（封面，服务端实跑引擎）· `/app`（记录页：情绪轮+滑杆→实时 3D）· `/research` · `/translation` · `/logic` · `/deck` · `/api/snapshots`（ƒ 动态，in-memory demo）。

---

## 2. 环境与坑（重要）

- **Node**：`C:\Users\Rain\AppData\Local\Programs\nodejs`（便携版 v24，已写入用户 PATH；本工具进程内要手动注入上面的 PATH）。
- **代理**：系统走 `http://127.0.0.1:7897`；另有 `198.18.0.1` Meta 适配器（Clash/Mihomo TUN）。npm 已配代理。
- **不是 git 仓库** → 不能用 `git diff` 判断改动范围；用 mtime / 文件内容判断。
- **预览 MCP（Claude_Preview）在本机无头浏览器渲染器有缺陷**：截图超时、WebGL canvas 卡在默认 300×150、反复 Context Lost。**这是预览环境问题，非 app bug**——用户真实 NVIDIA Chrome 正常。**3D 视觉一律靠用户真机目检 + `tsc`/eval/inspect，别信预览截图。**
- **WebGL 无法在无头环境截图**：验证 3D 必须真机。
- **本机网络当前是 "Public" 防火墙类型**；电脑局域网 IP = `192.168.5.8`（手机访问要用它，不是 localhost，且需同 Wi-Fi + 放行 3000）。

---

## 3. 绝对硬约束（违反即返工）

### 3.1 配色（2026-06-30 调整为 HYBRID，旧红线已松绑）
> **更新（2026-06-30）：** 用户拿 5 张作品集板复盘后，把"全站 teal-only"改成 **hybrid**：
> **UI 外壳/导航/图表/文字** 继续用下面的 teal house style（保持调性统一）；
> 但 **内容区**——真实渲染图（`public/renders/*`）、材质照片、3D 空间——**允许带作品集本来的满色**（绿/金/粉/紫/暖光等）。
> 即"teal 外壳 + 真图原色内容"。详见记忆 `color-realism-pivot`。**不要再无脑把内容里的彩色清成 teal。**

**teal house style 允许值（UI 外壳用）：**
```
#4E7A8A  #6A96A4  #8AAFBA  #A9C7D0  #C9DEE6   (teal 色卡 5 支)
#FFFFFF  #000000
#3d6573  #2e4d58  #365a66                     (teal×黑，正文/深色对比)
#dcebf0  #eef5f8                              (teal×白，浅表面)
```
不要创造新色相。颜色统一走 `app/globals.css` 的 `:root` token（只改值不改名，全站联动）。
审计命令（应只剩上面这些）：
```powershell
cd "E:\Desktop\Mood Builder Design System\webapp"
Select-String -Path app,components,lib -Pattern "#[0-9A-Fa-f]{6}" -Recurse
```
当前审计：✅ 干净，无杂色相。

### 3.2 零墙外 CDN（中国大陆可直接打开）
发到浏览器的包**不能向任何被墙资源发请求**。已验证生产 `.next` 无 googleapis/gstatic/unpkg/jsdelivr/cdnjs/polyfill/analytics/githack。
- 字体本地：`public/fonts/*.woff2`（无 Google Fonts、无 `next/font`）。
- 世界地图数据本地：`public/world-110m.json`。
- **做 3D 时禁止 drei `<Environment preset>` / `useEnvironment({files:url})`**（拉 CDN HDRI）。当前用的是**本地 canvas 程序化环境**（`SpaceScene.tsx` 的 `makeEnvironmentTexture`），保持这种做法。
- 唯一外部物是一个**可点**的 `ourworldindata.org` 归属链接（点了才访问，不阻塞页面）。

### 3.3 其它
- **审美对标作品集图**：P42 Global Research 地图+多图表；P43 Translation Database 材料/植物/天气/声音/风格拼贴；P44 Logic 情绪%→翻译域→输出；P45 14 手机屏；P46 iPad Observation Deck 精细等距堆叠；P4 封面叠层。
- **动效**：复用 `components/Reveal.tsx`（滚动入场，首屏模块传 `aboveFold`）、`.ulink`（下划线）、`.lift`（悬停抬升）；**首屏默认可见**（慢网/无 JS 不空白）；一切动效遵守 `prefers-reduced-motion`。
- **引擎是唯一数据源**：能算的不写死。

---

## 4. 架构 / 关键文件

**引擎层（项目 IP）`webapp/lib/engine/`：**
- `translation-db.ts` — `EMOTION_DB`（6 家族 confident/calm/joyful/scared/sad/mad，每个含 style/material/vegetation/roof/light/sound/weather/verticality/massingComplexity/circulationTurns/energy/pleasantness/accent）、`WHEEL_ORDER`、`MATERIALS/LIGHT_SOURCES/PLANTS/SOUNDSCAPE/ATMOSPHERE`、`SAMPLE_MIX`。
- `evolution-engine.ts` — `evolve(subjective, physio) → {reading, params}`；`vectorFromWheel(angle, radius)`。
- `composer.ts` — `composeSpace(params, seed) → ComposedSpace{blocks, vegetation, path, params, seed}`；`makeSeed(...)`。
- `weather.ts` — `weatherFromReading(energy, pleasantness) → clear|cloudy|rain|storm|snow`；`WEATHER_LABEL`。
- `mix.ts` — `mixFromVector(vector) → {key,label,pct}[]`（6 家族情绪配比，供 /logic）。
- `types.ts` — `EmotionKey/SpatialParams/ComposedSpace/MassingBlock/VegetationInstance/DailyPlatform`。

`webapp/lib/portfolio/content.ts` — 用引擎生成 14 天样例平台 `DAILY_PLATFORMS` + 研究/流程共享内容。

**页面 `webapp/app/`：** `page.tsx`(/) · `app/page.tsx`(/app) · `research/` · `translation/` · `logic/` · `deck/` · `api/snapshots/route.ts` · `globals.css` · `boards.module.css` · `layout.tsx`。

**组件 `webapp/components/`：** `Reveal.tsx` · `EmotionWheel.tsx` · `three/SpaceScene.tsx`。

**新增依赖（除 three/fiber/drei 外）**：`d3-geo` `topojson-client`（+types）——用于 /research 真地图。

---

## 5. 各页当前状态（全部 build 通过 + 配色合规）

| 页/项 | 状态与要点 |
|---|---|
| `/`（封面） | 服务端实跑引擎出读数；Reveal 入场。 |
| `/app`（记录页 + 3D） | 情绪轮 + 3 个生理滑杆 → 引擎实时 → `SpaceScene` 生成 3D；天气随情绪场切换；Save snapshot 真实 POST 到 API。**3D 见 §6。** |
| `/research` | **真 177 国等值世界地图**（`WorldChoropleth.tsx` + `worldData.ts` + d3-geo + `public/world-110m.json`），5 档 teal 分级、hover 出数值；+ 负担条(width-draw+count-up)/趋势折线(stroke-draw)/年龄条/男女散点。数据：OWID 该图不可再分发(403)，用 IHME GBD 公开区间代表性值，已标来源。 |
| `/translation` | `TranslationExplorer.tsx`：中央情绪轮 + 材料/植物/天气/光/声/风格的**程序化 SVG 图集**（`MaterialVisual` 等），点情绪联动切换，文字大减。 |
| `/logic` | `LogicDiagram.tsx` + `mix.ts`：情绪轮+滑杆→6 情绪配比条 + 翻译域(Vegetation/Materials/Roof/Components/Circulation/Undulations) + 链路 + 设计输出，全部按当前心情实时变。 |
| `/deck`（观景台） | `DeckView.tsx`：**每个平台 = 该日 `composeSpace` 的等距 SVG 微缩空间**（`MiniSpace`，非 14 个 WebGL canvas）；Altitude 滑杆、Overview/Immersive 模式、affective trace 联动、标注。 |
| `/api/snapshots` | GET/POST，**in-memory demo**（重启清空，已在代码+README 标注）；ƒ Dynamic。 |

---

## 6. 3D 场景 `components/three/SpaceScene.tsx`（最复杂，Codex 已大升级）

- `C` 常量 = teal 卡 5 支 + 白 + 黑（颜色唯一来源）。
- **材质**：`makeTexture(kind)` 程序化 canvas 贴图（marble/wood/metal/stone/glass）→ `meshPhysicalMaterial`（bump/roughness/metalness/clearcoat/ior/envMapIntensity）。
- **环境反射**：`makeEnvironmentTexture()` 本地 teal→白渐变 equirect（`ProceduralEnvironment` 挂到 `scene.environment`）——**不是 CDN HDRI**，务必保持本地。
- **建筑构件**：Column/Arch/Dome/Stair/Rail/FacadeLines/RoofRibs/EdgeTrim/Apertures/RoofPlanting，由 `params`/`style` 驱动（Byzantine→穹顶，Classical→柱列…）。
- **植被**：pine 叠锥 / canna 叶簇 / blossom 球簇 / shrub；`ExtraPlanting` 按密度补植。
- **场景细节**：`PeopleField`（路径上的小人）、`GroundDetails`（铺装/碎石/水池/草丛/路缘）。
- **天气**：`SkyClouds`/`Precipitation`(雨雪粒子)/`Lightning`，按 `weather` 切换 + 调天空雾。
- **渲染**：`frameloop="always"`、ACESFilmic 色调映射、SRGB、`ContactShadows`、shadow 1024、`webglcontextlost` 自恢复、`resize.offsetSize`。
- ⚠️ **性能风险**：几何量很大（每块体块十几网格 + 人/植被/地面 + frameloop always）。弱机/手机可能掉帧。要优化就上 `InstancedMesh`（人、植被、碎石、铺装是首选合批对象），或弱机降级关 ContactShadows/people/详节。

---

## 7. 公开链接 / 隧道（用户选了"临时 Cloudflare 隧道"）

- cloudflared 已下载：`C:\Users\Rain\AppData\Local\Programs\cloudflared\cloudflared.exe`（54MB，已验证可执行）。
- **必须走生产版**：dev 在 Next 16 经隧道会因跨源（`/_next` 资源）挂掉。流程：停 dev → `next build` → `next start`（端口 3000）→ 隧道。
- **必须给 cloudflared 设代理注册**，否则直连 `api.trycloudflare.com` 被 TUN 掐成 `unexpected EOF`：
  ```bash
  export HTTPS_PROXY=http://127.0.0.1:7897; export HTTP_PROXY=http://127.0.0.1:7897; export NO_PROXY=localhost,127.0.0.1
  "/c/Users/Rain/AppData/Local/Programs/cloudflared/cloudflared.exe" tunnel --no-autoupdate --protocol http2 --url http://localhost:3000
  # 从日志 grep 'https://...trycloudflare.com' 拿 URL
  ```
- 临时隧道：只在电脑+隧道开着时有效、URL 随机、会话重启会杀掉后台进程（需重起）。永久方案见 §9。

---

## 8. 协作背景（与 Codex 跨模型协作）

- 工作流：Claude Code 建 → Codex 带单一 mandate review/做 → 跑 `npm run check` 为 ground truth。仓库是信源。
- 现存交接/记录文档（根目录）：
  - `CLAUDE-HANDOFF-NEXT-20260629.md` — 给 Codex 的下一阶段任务单（用户重写过；Task A=/logic、B=/translation、C=/research、D=/deck、E=/app 3D、F=统一 QA）。
  - `CLAUDE-FIX-REQUEST-20260629-0512.md` / `CLAUDE-FIX-RESPONSE-20260629-0512.md` — 上一轮 review 修复往返。
  - `CLAUDE-HANDOFF.md` / `FIGMA-REVIEW-NOTES.md` — 更早的 Figma 侧（已弃，改走 webapp）。
- Codex 这一轮已完成 Task A/B/D/E（见 §5/§6），`/research`（Task C）是 Claude 做的。**剩 Task F 统一 QA。**

---

## 9. 待做 / 下一步（新会话从这里接）

1. **整站统一 QA（Task F）**：颜色再审一遍、动效一致性、可达性（aria/键盘/reduced-motion）、各页响应式、`npm run check` 收口。
2. **3D 性能优化**（如真机掉帧）：`InstancedMesh` 合批人/植被/碎石/铺装；或弱机降级开关。
3. **公开链接**：按 §7 重起临时隧道；若要永久 + 中国稳定访问，考虑国内服务器（用户之前选了"临时隧道"，永久部署待定）。
4. **可选深化**：3D 继续向 P46 iPad 图靠（更精构件/光影）；`/api/snapshots` 真持久化（JSON/SQLite）；14 屏目前仅在 `/logic` 以 build order 记录，未逐屏实现。

## 10. 已知风险/坑速查

- 配色红线（§3.1）；零 CDN 红线（§3.2，3D 别用 drei CDN env）。
- `bufferAttribute` 在本 three 版本要用 `args={[array, itemSize]}`（不是 array/count/itemSize 属性），否则 tsc 报错。
- `npm audit` 有 2 个 moderate（next 自带 postcss 传递依赖）——**不要 `audit fix --force`**（会把 next 降到 9.3.3）。
- 严格 TS：未使用的参数/变量会报错，删代码时要清理。
- 会话重启会杀掉后台 dev/prod/tunnel 进程。

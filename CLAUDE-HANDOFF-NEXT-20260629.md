# Codex 下一阶段执行交接单：Mood Builder Webapp 深化

文件编码：UTF-8  
项目根目录：`E:\Desktop\Mood Builder Design System`  
Web 工程目录：`E:\Desktop\Mood Builder Design System\webapp`

这份交接单是给 Codex 的可执行任务说明。不要只改文档，要完成实际页面、交互、3D 渲染和代码行为。

---

## 0. 当前状态

技术栈：

- Next.js 16 + React + TypeScript
- Three.js / `@react-three/fiber` / `@react-three/drei`
- 样式主要在 CSS Modules + `app/globals.css`
- 引擎层在 `webapp/lib/engine/`

运行命令：

```powershell
$env:Path="C:\Users\Rain\AppData\Local\Programs\nodejs;$env:Path"
cd "E:\Desktop\Mood Builder Design System\webapp"
npm install
npm run dev
npm run check
```

`npm run check` 必须保持通过。它包含：

- `tsc --noEmit`
- `next build`

当前已经完成：

- `/app`：情绪轮 + 生理滑杆 → 引擎实时融合 → 3D 空间生成。
- `/app`：天气系统已接入，天气由当前情绪场驱动，支持 clear/cloudy/rain/storm/snow。
- `/research`：已有初步可视化，包含疾病负担条形图和趋势折线。
- `/translation`：已有交互式情绪轮，点击情绪家族会联动建筑词汇。
- `/deck`：已有交互式 Observation Deck 雏形。
- 全站颜色已被用户锁定为指定 teal 色卡 + 白 + 黑。

---

## 1. 绝对约束

### 1.1 颜色硬约束

只允许使用用户最后指定的 teal 色卡 + 白色 + 黑色。不要再引入另一张蓝色卡，不要使用绿、金、粉、橙、紫、暖黄、彩色 HDRI。

允许色值：

```text
#4E7A8A
#6A96A4
#8AAFBA
#A9C7D0
#C9DEE6
#FFFFFF
#000000
```

为了正文对比，可以使用 `#4E7A8A` 与黑色混合得到的深 teal，例如当前代码中的：

```text
#3d6573
#2e4d58
```

但不要创造新的色相。所有新的 UI、图表、SVG、3D 材质、贴图、粒子、阴影、天空，都必须留在 teal + 白 + 黑范围内。

验收方式：

```powershell
cd "E:\Desktop\Mood Builder Design System\webapp"
Select-String -Path app,components,lib -Pattern "#[0-9A-Fa-f]{6}" -Recurse
```

逐项检查，不得出现非允许色相。

### 1.2 审美方向

参考用户提供的作品集图：

- `P42 (1).png`：Global Research 的地图 + 数据图表密集信息排版。
- `P43 (1).png`：Translation Database 的材料、植物、天气、声音、建筑风格多图像拼贴。
- `P44 (1).png`：Logic Diagram 的情绪百分比 → 翻译域 → 设计输出逻辑。
- `P45 (1).png`：14 个手机屏幕与系统流程。
- `P46 (1).png`：iPad Observation Deck 的精细等距模型、平台堆叠、环境、标注、UI 浮层。
- `P4 (1).png`：封面/主视觉的空间叠层、teal 白色背景、平台、路径与项目叙事。

目标不是做成普通 SaaS 页面，而是作品集式的交互视觉板。

---

## 2. 任务顺序

按下面顺序执行，不要跳到 3D 以后再回来补基础页面。每完成一阶段必须运行 `npm run check`。

1. `/logic` 个性化逻辑链路。
2. `/translation` 继续深化：材料图片化、植物/天气/声音/风格视觉化，减少纯文字。
3. `/research` 继续深化：更接近 P42 的地图与多图表视觉系统。
4. `/deck` 深化为 iPad Observation Deck 视觉。
5. `/app` 主 3D 模型深度优化：材质、植被、建筑构件、渲染质量。
6. 最终全站统一检查：颜色、动效、可访问性、构建。

---

## 3. 任务 A：`/logic` 个性化逻辑链路

目标：把 `/logic` 从静态流程说明升级为“根据一个具体心情实时变化”的逻辑图。

涉及文件建议：

- 新增：`webapp/app/logic/LogicDiagram.tsx`
- 新增：`webapp/app/logic/logic.module.css`
- 修改：`webapp/app/logic/page.tsx`
- 可新增：`webapp/lib/engine/mix.ts`

具体事务：

1. 新建客户端组件 `LogicDiagram.tsx`。
2. 在页面顶部放一个“当前心情输入”：
   - 可以复用 `components/EmotionWheel.tsx`。
   - 或做紧凑版：6 个情绪按钮 + Energy / Pleasantness 两个滑杆。
3. 新建纯函数 `mixFromAffect(energy, pleasantness)`：
   - 读取 `EMOTION_DB` 里 6 个情绪家族的 `energy` / `pleasantness` 锚点。
   - 用反距离权重或 softmax 算出 6 个情绪百分比。
   - 输出 `{ key, label, pct }[]`，总和约等于 100。
4. 页面左侧显示 6 个情绪百分比条：
   - 参考作品集 `P44` 的 Confident / Calm / Scared / Sad / Mad / Joyful 百分比。
   - 拖动输入时百分比条平滑过渡。
5. 中央显示翻译域：
   - Vegetation
   - Materials
   - Roof
   - Components
   - Circulation
   - Undulations
6. 右侧显示“设计输出”：
   - 从 `evolve()` 和 `composeSpace()` 得到当前 `params`。
   - 输出当前 material、roofForm、vegetationDensity、verticality、massingComplexity、circulationTurns、weather。
7. 做一条动态链路：
   - `Input → Emotion State Engine → Translation Domains → Spatial State Engine → Temporal Layer`
   - 节点随当前心情点亮。
   - 线条可以用 SVG stroke-dashoffset 做缓慢流动。
8. 可选：右侧嵌入小型 3D 预览，复用 `SpaceScene`，但要注意性能。

验收：

- 改变心情输入，6 个情绪百分比、翻译域、输出参数同步变化。
- 不再是静态列表。
- 全部颜色只用 teal + 白 + 黑。
- `npm run check` 通过。

---

## 4. 任务 B：`/translation` 材料和数据库图片化

用户明确说：“数据库文字太多，视觉效果太少，要把每个材料的图片都加上去。”

目标：把 `/translation` 从“文字数据库”升级为类似 `P43` 的视觉拼贴数据库。每类材料、植物、天气、声音、建筑风格都要有可视化缩略图。

涉及文件建议：

- 修改：`webapp/app/translation/TranslationExplorer.tsx`
- 修改：`webapp/app/translation/translation.module.css`
- 可新增：`webapp/app/translation/MaterialAtlas.tsx`
- 可新增：`webapp/app/translation/visualAssets.ts`

具体事务：

### 4.1 材料缩略图

为 `MATERIALS` 里的每个材料生成图像化缩略图：

- Concrete
- Marble
- Wood
- Glass
- Granite
- Steel / Iron

重要：如果没有现成图片，不要联网乱找素材。优先做程序化 SVG/CSS 视觉纹理：

- Concrete：噪点纹理 + 块面裂纹。
- Marble：白底 + teal 细脉络。
- Wood：线性纹理 + 长条年轮。
- Glass：半透明面 + 高光线。
- Granite：点状颗粒。
- Steel / Iron：拉丝条纹 + 冷高光。

这些可以作为“图片化组件”，不一定是外部 png。关键是视觉上像材料卡，而不是纯文字。

### 4.2 植物、天气、光源、声音可视化

对照 `P43`：

- 植物：树形轮廓、草地带、花簇。
- 天气：晴、云、雨、雪、暴风，用 SVG / CSS 粒子图形。
- 光源：spotlight、moonlight、lantern、LED 等，用几何光束图示。
- 声音：waveform 线条。

所有视觉仍只用 teal + 白 + 黑。

### 4.3 交互

点击情绪轮某个家族时：

- 主材料图切换。
- 植物图切换。
- 天气图切换。
- 建筑风格图切换。
- 下方文字说明只保留关键短句，避免大段文字堆积。

### 4.4 布局

布局参考 `P43`：

- 中央大情绪轮。
- 左侧材料与植物视觉卡。
- 右侧建筑风格/天气/光源视觉卡。
- 底部声音 waveform。

验收：

- 每个材料都有明显图片/纹理缩略图。
- `/translation` 一屏内视觉占比明显高于文字。
- 点击不同情绪时视觉卡同步切换。
- 不出现非 teal 色。
- `npm run check` 通过。

---

## 5. 任务 C：`/research` 全球研究可视化深化

目标：让 `/research` 更接近 `P42` 的 Global Research，而不是普通图表页。

涉及文件建议：

- 修改：`webapp/app/research/ResearchViz.tsx`
- 修改：`webapp/app/research/research.module.css`
- 可新增：`webapp/app/research/WorldMentalMap.tsx`

具体事务：

### 5.1 世界地图视觉

做一个简化世界地图视觉层。不要追求 GIS 准确，可以用 SVG abstract map：

- 五大洲/主要地区用 teal 深浅块面。
- 背后有经纬网格弧线。
- 大字漂浮：Depressive disorders / Anxiety disorders / Bipolar disorder / Schizophrenia。
- 地区标注线和小段说明。

如果做真实地图太耗时，可用“抽象大陆块 + 网格 + 标签”完成视觉意图，重点是作品集观感。

### 5.2 多图表

在当前条形图和趋势折线基础上继续加：

- Age group horizontal bars。
- Male vs female scatter plot。
- Region comparison mini charts。
- 右下角 legend / scale。

### 5.3 动效

- 地图区域滚动入场后逐块淡入。
- 经线/纬线轻微描线。
- 大字低透明漂浮，但不要太花。
- 图表条和折线维持目前的绘制动画。

### 5.4 文案

文案要像作品集说明，不要像普通 dashboard：

- 每个区域 1-2 句研究洞察。
- 文字量可以密，但要变成“地图注释”，不是卡片堆。

验收：

- `/research` 第一眼像研究地图板，而不是普通 web dashboard。
- 至少包含地图层、趋势图、负担条、年龄条、散点图四类视觉。
- 交互/动效存在，但不影响 reduced-motion。
- `npm run check` 通过。

---

## 6. 任务 D：`/deck` 深化为 iPad Observation Deck

目标：参考 `P46`，把 `/deck` 做成 iPad 风格的沉浸式观察台。

涉及文件建议：

- 修改：`webapp/app/deck/DeckView.tsx`
- 修改：`webapp/app/boards.module.css`
- 可新增：`webapp/app/deck/deck.module.css`

具体事务：

1. 页面视觉改成更接近 iPad：
   - 深色外框或沉浸式大视口。
   - 中央平台堆叠。
   - 右上 Recording 状态。
   - 左侧 Altitude slider。
   - 底部 Affective Trace 小图。
   - 右下模式切换：Overview / Immersive。
2. 中央平台堆叠要更丰富：
   - 平台不是单条横线，要有厚度、投影、路径、楼梯、网格。
   - 当前选择的 day 高亮。
   - 每个平台挂注释气泡，显示 date / keywords / metrics / behavior cue。
3. Trace 图要和 slider 联动：
   - 拖动 altitude/day 时，trace 上对应点高亮。
4. 加 mode toggle：
   - Overview：显示平台堆叠和标注。
   - Immersive：把界面压暗，只保留少量控件和当前平台说明。

验收：

- `/deck` 第一眼接近 iPad Observation Deck 的信息密度和空间感。
- Altitude slider、平台、trace 三者联动。
- 不使用非 teal 色。
- `npm run check` 通过。

---

## 7. 任务 E：主页面 `/app` 3D 模型深度优化

这是最大任务。用户明确要求：“我需要清晰的渲染，材质贴图，渲染渲染，还是渲染。不是单一体块。”

目标：把当前 `SpaceScene` 从“参数化体块模型”升级为接近 iPad 效果图的“精细等距空间渲染”。

涉及文件建议：

- 重构：`webapp/components/three/SpaceScene.tsx`
- 可新增：
  - `webapp/components/three/Architecture.tsx`
  - `webapp/components/three/Vegetation.tsx`
  - `webapp/components/three/Weather.tsx`
  - `webapp/components/three/Materials.ts`
  - `webapp/components/three/EnvironmentRig.tsx`

### 7.1 建筑构件

替代单一 box 体块，增加：

- 台基 / platform thickness。
- 柱列 / colonnade。
- 拱券 / arch。
- 穹顶 / dome。
- 尖塔 / spire。
- 楼梯 / stairs。
- 栏杆 / rail。
- 路径 / curved path。
- 小构件 / pavilion / wall fragment。

构件选择必须由引擎参数驱动：

- `architectureStyle`
- `material`
- `roofForm`
- `verticality`
- `massingComplexity`
- `circulationTurns`
- `vegetationDensity`
- `weather`

不要做成纯静态模型。

### 7.2 材质

需要看起来“有材质”，即使不用真实贴图，也要程序化模拟：

- Stone / concrete：噪点、粗糙面、边缘高光。
- Marble：白底 + teal 纹理线。
- Wood：细线纹理。
- Glass：透明高光。
- Steel：拉丝/高光。

实现方式：

- 可以用 CanvasTexture 生成程序化纹理。
- 也可以用多层几何 + 颜色/roughness/metalness 近似。
- 严禁引入彩色外部纹理，除非先转成 teal/白/黑。

### 7.3 植被

当前树冠太抽象，需要清晰分层：

- Pine：多层锥体 + 树干。
- Shrub：多个小球簇。
- Blossom：树干 + 分枝 + 白/teal 小花点。
- Canna / grass：竖向叶片簇。

用 `InstancedMesh` 做数量，不要手写大量单独 mesh。

### 7.4 渲染质量

建议使用：

- `ContactShadows` 或 `AccumulativeShadows`
- `RandomizedLight`
- `Environment` / `Lightformer`，但颜色必须 teal/白。
- 可考虑安装：

```powershell
npm install @react-three/postprocessing postprocessing
```

加入轻量：

- AO / ambient occlusion
- 轻微 bloom
- 可选景深

注意性能。天气动画已使用 `frameloop="always"`，后期不要过重。

### 7.5 天气保留

现有天气系统必须保留：

- clear
- cloudy
- rain
- storm
- snow

天气仍由 `lib/engine/weather.ts` 驱动，不要随机。

### 7.6 验收

- 在真实 Chrome 里，模型明显不是单一体块。
- 有清晰材质感、植被层次、建筑构件、阴影、天气。
- 视觉接近 `P46` 的等距平台渲染方向，但颜色遵守 teal/白/黑。
- `/app` 仍能拖拽旋转。
- `npm run check` 通过。

---

## 8. 最终测试要求

所有任务完成后运行：

```powershell
$env:Path="C:\Users\Rain\AppData\Local\Programs\nodejs;$env:Path"
cd "E:\Desktop\Mood Builder Design System\webapp"
npm install
npm run check
npm audit
```

说明：

- `npm run check` 必须通过。
- `npm audit` 如果仍出现 Next/PostCSS moderate warning，不要 `npm audit fix --force`，因为它可能把 Next 降级到旧版本。只需在交付说明中说明风险。

---

## 9. 最终交付说明格式

Codex 完成后必须回复：

1. 修改文件列表。
2. 每个任务 A/B/C/D/E 的处理结果。
3. 颜色合规说明。
4. `npm run check` 结果。
5. `npm audit` 结果。
6. 真实浏览器里 `/app` 3D 模型的肉眼检查结论。
7. 仍未完成或存在风险的内容。

---

## 10. 关键提醒

- 不要再把网页做成“纯文集框架列表”。每个页面都要有视觉化、动效和交互。
- 不要为了快而贴一张静态大图冒充交互。
- 不要把所有东西染成蓝色滤镜。主表面是白，teal 负责结构、数据、线条、模型、强调。
- 不要引入其他颜色。用户已明确禁止。
- 3D 是本项目的核心交付，不是装饰。

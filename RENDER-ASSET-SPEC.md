# Mood Builder — 渲染图素材规范（你导出图库照这个来）

> 目的：App 的空间画面**不靠实时 3D**，而是用你的离线渲染图**分层合成**，所以质量 = 你导出的渲染质量（iPad 展示页那种尺度与细节）。
> 引擎只决定"用哪些层、怎么叠"，画面全用你的图。新图全部放进 `webapp/public/renders/library/`。

---

## 0. 所有层通用的硬规范（务必一致，否则叠不齐）

| 项 | 规范 |
|---|---|
| **相机/投影** | 与现有 `webapp/public/renders/space-iso-*.png` **完全相同的等距相机**（同角度、同焦距）。新图必须能和这三张对齐。 |
| **画布尺寸** | 统一 **1600 × 1200 px**，所有层同尺寸、同构图。 |
| **背景** | **透明 PNG-24（带 alpha）**。建筑/植被/天气层四周必须透明；地块层只画地块本身，四周透明。 |
| **注册点（对齐基准）** | 地块菱形中心固定在画布 **(800, 760)**。所有层都以这个点为原点摆放，叠起来才不会错位。 |
| **配色** | 作品集 hybrid 配色，sRGB。 |
| **命名** | 全小写、用连字符，见下。文件名就是引擎索引的 key，**别改格式**。 |

---

## 1. 地块层 `platform/`（情绪**波动跨度** → 大小/规整度）

命名：`platform-{size}-{regularity}.png`
- size：`s`（小，平稳）/ `m`（中）/ `l`（大，剧烈波动）
- regularity：`clean`（规整边缘）/ `broken`（破碎不规整）

- **最小集（3）**：`platform-s-clean` · `platform-m-clean` · `platform-l-broken`
- **完整集（6）**：3 size × 2 regularity

引擎逻辑：周内情绪向量方差小 → `s-clean`；方差大 → `l-broken`。

## 2. 建筑层 `building/`（**情绪家族 × 强度**，自带建筑尺度与细节）

命名：`building-{emotion}-{intensity}.png`
- emotion：`confident` `calm` `joyful` `scared` `sad` `mad`
- intensity：`1`（弱）`2`（中）`3`（强）

每个家族用它在 DB / 作品集里对应的建筑语言（古典/拜占庭/哥特/解构/高技…，**你定**），强度越高越高耸/繁复。建筑底座坐在注册点 (800,760) 的地面上、向上生长，四周透明。

- **最小集（6）**：每家族出一张 `-2`（中强度）即可先跑全流程
- **完整集（18）**：6 家族 × 3 强度

## 3. 植被层 `vegetation/`（密度）

命名：`veg-{density}.png`，density：`sparse` `medium` `lush`（3 张）。
摆位贴合地块脚印，叠在建筑前。
> 想更真可拆 `veg-back-*` / `veg-front-*`（建筑前后各一套），不强制。

## 3.5 人物/尺度层 `people/`（P46 的"尺度与细节"很大程度靠人物与坡道）

命名：`people-{density}.png`，density：`sparse` `medium` `busy`（3 张，透明）。
小人物群 + 连接坡道/楼梯，散布在地块上,给建筑一个**可读的尺度**(像 P46 里到处的小人和白色坡道)。叠在植被之后、天气之前。
> 引擎按情绪社交性自动选:joyful/confident→busy,calm→medium,sad/scared/mad→sparse。

## 4. 天气/光层 `weather/`（氛围叠加，可选但强烈建议）

命名：`weather-{clear|cloudy|rain|storm|snow}.png`（5 张，透明氛围层：云/雨丝/雪/闪电）。
光的晨昏色调我先用 CSS 滤镜/混色做，**不用你出图**；除非你想要更精的光层再补 `light-{dawn|day|dusk|night}.png`。

---

## 5. 叠放顺序（z，从后到前）
```
地块 platform  →  建筑 building  →  植被 veg  →  人物/坡道 people  →  天气 weather
```
引擎按"当周主导情绪 + 强度 + 波动 + 天气"挑每层文件名，合成成一张图。

## 6. 交付批次（按你的精力来）
- **MVP（20 张）**：3 地块 + 6 建筑(每家族中强度) + 3 植被 + 3 人物 + 5 天气 → 够让全流程跑起来且好看。
- **完整（约 40 张）**：6 地块 + 18 建筑 + 3~6 植被 + 3 人物 + 5 天气。

导出后丢进 `webapp/public/renders/library/`，告诉我一声，我更新 manifest（`webapp/lib/app/asset-manifest.ts`，emotion/强度/天气 → 文件名的映射表，加图只需丢文件+加一行）。

## 7. 我并行在做的（不等你）
地基:iOS 外壳 + 底部 Tab、localStorage 存储、数据模型(CheckIn/DaySpace/WeekPlatform)、**分层合成渲染器**(先用现有 3 张当占位)。你的图库一到,改 manifest 即全站替换,无需改逻辑。

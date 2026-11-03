// 把仓库根目录的单文件可点原型(10 屏手机流程)拷进静态导出,线上地址为 <站点>/prototype/
// 由 npm run build:static / build:portfolio 在 next build 之后调用。
// 原型里的渲染图按相对路径 assets/renders/ 引用,所以这几张图要一起拷过去。
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const webapp = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(webapp, "..");
const src = join(repo, "Mood Builder - Prototype.html");
const outDir = join(webapp, "out", "prototype");
const RENDERS = ["space-iso-detail.png", "space-iso-open.png", "space-iso-lush.png", "immersive-ruins.png"];

if (!existsSync(join(webapp, "out"))) {
  console.error("add-prototype: out/ not found — run the static build first.");
  process.exit(1);
}
if (!existsSync(src)) {
  console.warn("add-prototype: prototype HTML not found, skipping:", src);
  process.exit(0);
}

mkdirSync(join(outDir, "assets", "renders"), { recursive: true });
copyFileSync(src, join(outDir, "index.html"));
for (const name of RENDERS) {
  copyFileSync(join(repo, "assets", "renders", name), join(outDir, "assets", "renders", name));
}
console.log(`add-prototype: copied prototype + ${RENDERS.length} renders → out/prototype/`);

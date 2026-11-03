import type { NextConfig } from "next";

// MB_STATIC=1 → 静态导出模式:输出纯静态站到 out/。平时 dev / npm run check 不受影响。
//   npm run build:static     → 挂在域名根目录(Netlify 独立 demo 站用这个,见仓库根目录 netlify.toml)
//   npm run build:portfolio  → 挂在 /moodbuilder/ 子路径下(拷进作品集站 rainzhao01.netlify.app/moodbuilder/ 用)
// MB_BASE_PATH 决定子路径;代码里 public/ 资源要用 lib/base-path.ts 的 withBase() 拼前缀。
const isStatic = process.env.MB_STATIC === "1";
const basePath = isStatic ? (process.env.MB_BASE_PATH ?? "").replace(/\/+$/, "") : "";

const nextConfig: NextConfig = {
  // Next.js 16 dev 默认拦截非 localhost 来源的 dev 资源(HMR/JS chunk)。
  // 用户经 127.0.0.1(绕过代理)或局域网 IP(手机)访问时必须放行,
  // 否则页面只有 SSR 骨架:无水合、无 3D、交互全死。
  allowedDevOrigins: ["127.0.0.1", "192.168.5.8"],
  // 构建时把 basePath 注入客户端代码,供 withBase() 使用
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(isStatic
    ? {
        output: "export" as const,
        ...(basePath ? { basePath } : {}),
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;

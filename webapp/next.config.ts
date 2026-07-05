import type { NextConfig } from "next";

// MB_STATIC=1 → 静态导出模式:输出纯静态站到 out/,挂在作品集站
// https://rainzhao01.netlify.app/moodbuilder/ 子路径下(npm run build:portfolio)。
// 平时 dev / npm run check 不受影响(无 basePath)。
const isStatic = process.env.MB_STATIC === "1";

const nextConfig: NextConfig = {
  // Next.js 16 dev 默认拦截非 localhost 来源的 dev 资源(HMR/JS chunk)。
  // 用户经 127.0.0.1(绕过代理)或局域网 IP(手机)访问时必须放行,
  // 否则页面只有 SSR 骨架:无水合、无 3D、交互全死。
  allowedDevOrigins: ["127.0.0.1", "192.168.5.8"],
  ...(isStatic
    ? {
        output: "export" as const,
        basePath: "/moodbuilder",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;

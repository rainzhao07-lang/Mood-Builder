/**
 * basePath 前缀。静态导出挂在子路径下时(如作品集站的 /moodbuilder/),
 * next/link 会自动加 basePath,但 next/image 的字符串 src、fetch()、<img> 不会,
 * 必须手动拼上,否则部署后图片和数据全部 404。
 * 值由 next.config.ts 在构建时注入(NEXT_PUBLIC_BASE_PATH),开发模式下为空。
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** 给 public/ 下的资源路径加上 basePath:withBase("/renders/a.png") → "/moodbuilder/renders/a.png" */
export function withBase(path: string): string {
  return `${BASE_PATH}${path}`;
}

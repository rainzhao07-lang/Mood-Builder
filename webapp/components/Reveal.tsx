"use client";

/* ============================================================
   Reveal — 滚动入场动效(整站通用,首屏安全)
   设计原则(交付级):
   · SSR / 首帧:不隐藏任何内容 —— 元素默认可见(CSS 无 data-pending)。
     因此慢网速、慢 hydration、JS 失败时首屏都不会空白。
   · 客户端挂载后:只对"折叠线以下、当前不可见"的模块施加 data-pending
     (此时它在视口外,隐藏不可见),进入视口再移除 → 由下向上淡入。
   · 已在视口内(含首屏)的模块:保持可见,不做入场。
   · aboveFold:显式声明为首屏关键模块,永不隐藏(双保险)。
   · prefers-reduced-motion:由 globals.css 关停位移与过渡。
   ============================================================ */

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

type RevealProps = {
  children: ReactNode;
  /** 渲染成什么标签,默认 div */
  as?: ElementType;
  /** 入场延迟(ms),用于错峰 stagger */
  delay?: number;
  /** 上移距离(px) */
  y?: number;
  className?: string;
  style?: CSSProperties;
  /** 首屏关键模块:永不隐藏(默认可见,不做入场动画) */
  aboveFold?: boolean;
};

export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  y = 18,
  className = "",
  style,
  aboveFold = false,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  // "pending" 才隐藏;默认与首屏一致为可见,避免任何首帧空白
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (aboveFold) return; // 首屏关键模块:始终可见
    const el = ref.current;
    if (!el) return;
    // 挂载时已在视口内(含首屏)的内容保持可见,不隐藏不入场
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return;

    // 仅对折叠线以下(此刻不可见)的内容:先隐藏,进视口再入场
    setPending(true);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setPending(false);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [aboveFold]);

  return createElement(
    Tag,
    {
      ref,
      "data-reveal": "",
      "data-pending": pending ? "" : undefined,
      className,
      style: {
        ...style,
        "--reveal-y": `${y}px`,
        transitionDelay: pending ? "0ms" : `${delay}ms`,
      } as CSSProperties,
    },
    children
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "./shell.module.css";

const TABS = [
  { href: "/app", label: "Today", icon: IconToday },
  { href: "/app/deck", label: "Deck", icon: IconDeck },
  { href: "/app/insights", label: "Insights", icon: IconInsights },
  { href: "/app/studio", label: "Studio", icon: IconStudio },
] as const;

export default function TabBar() {
  // 静态导出开了 trailingSlash,pathname 会是 "/app/",先去掉结尾斜杠再比较
  const pathname = usePathname().replace(/\/+$/, "") || "/";
  return (
    <nav className={s.tabbar} aria-label="Primary">
      {TABS.map((t) => {
        const active = t.href === "/app" ? pathname === "/app" : pathname.startsWith(t.href);
        const Icon = t.icon;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`${s.tab} ${active ? s.tabActive : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {active && <span className={s.tabPill} aria-hidden="true" />}
            <Icon />
            <span className={s.tabLabel}>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/* SF-Symbols 风格:统一 26×26、1.9 描边、圆头圆角;选中靠 accent 着色 + 玻璃药丸,不改字重。 */
const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconToday() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <circle cx="14" cy="14" r="9.4" {...line} />
      <path d="M14 8.8V14l3.7 2.2" {...line} />
    </svg>
  );
}

function IconDeck() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <path d="M14 4.6l9 4.9-9 4.9-9-4.9z" {...line} />
      <path d="M5 14l9 4.9 9-4.9" {...line} />
      <path d="M5 18.4l9 4.9 9-4.9" {...line} />
    </svg>
  );
}

function IconInsights() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <path d="M5 22h18" {...line} />
      <path d="M8.5 22v-6.5M14 22v-12M19.5 22v-8.5" {...line} />
    </svg>
  );
}

function IconStudio() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <path d="M5 9h7M17 9h6" {...line} />
      <path d="M5 19h11M21 19h2" {...line} />
      <circle cx="14.5" cy="9" r="2.6" {...line} />
      <circle cx="18.5" cy="19" r="2.6" {...line} />
    </svg>
  );
}

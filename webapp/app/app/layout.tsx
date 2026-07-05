import type { ReactNode } from "react";
import s from "./shell.module.css";
import TabBar from "./TabBar";

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className={s.frameWrap}>
      <div className={s.phone}>
        <div className={s.statusbar}>
          <span className={s.time}>9:41</span>
          <span className={s.island} aria-hidden="true" />
          <span className={s.statusIcons} aria-hidden="true">
            <Cellular />
            <Wifi />
            <Battery />
          </span>
        </div>
        <div className={s.screen}>{children}</div>
        <TabBar />
        <span className={s.homeBar} aria-hidden="true" />
      </div>
    </div>
  );
}

/* 矢量状态栏图标 */
function Cellular() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="10" y="3" width="3" height="9" rx="1" />
      <rect x="15" y="0.5" width="3" height="11.5" rx="1" />
    </svg>
  );
}

function Wifi() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M1.6 4.1C4 2 6.1 1.1 8.5 1.1S13 2 15.4 4.1" />
      <path d="M4.2 6.9C5.6 5.7 6.9 5.1 8.5 5.1s2.9.6 4.3 1.8" />
      <circle cx="8.5" cy="10" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Battery() {
  return (
    <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
      <rect x="1" y="1.5" width="23" height="11" rx="3.2" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
      <rect x="2.8" y="3.3" width="17.5" height="7.4" rx="1.8" fill="currentColor" />
      <path d="M25.4 5v4c1.1-.3 1.1-3.7 0-4z" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

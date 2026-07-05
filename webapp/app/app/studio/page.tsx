"use client";

/* /app/studio — 自定义(四块)+ 本地数据管理。
   四块的真实编辑界面是后续切片;此处先立信息架构与状态。 */

import { useEffect, useState } from "react";
import { loadCheckIns, clearCheckIns } from "@/lib/app/store";
import { LIBRARY_READY } from "@/lib/app/asset-manifest";
import shell from "../shell.module.css";

const CUSTOM = [
  { title: "Emotion vocabulary", desc: "Add, rename or branch your sub-emotions." },
  { title: "Space appearance", desc: "Material, vegetation, palette & style per emotion." },
  { title: "Tracked signals", desc: "Choose which body signals to record." },
  { title: "Mapping rules", desc: "Tune how emotion translates into architecture." },
];

export default function StudioPage() {
  const [count, setCount] = useState<number | null>(null);
  const refresh = () => setCount(loadCheckIns().length);
  useEffect(refresh, []);

  function clearLocalData() {
    if (!window.confirm("Clear all local check-ins on this device?")) return;
    clearCheckIns();
    refresh();
  }

  return (
    <div className={shell.page}>
      <header className={shell.pageHead}>
        <span className="kicker">Studio</span>
        <h1 className={shell.h1}>Make it yours</h1>
        <p className={shell.sub}>Everything that drives your spaces — editable here.</p>
      </header>

      <div className={shell.rowList}>
        {CUSTOM.map((c) => (
          <div className={shell.row} key={c.title}>
            <div className={shell.rowText}>
              <b>{c.title}</b>
              <span>{c.desc}</span>
            </div>
            <span className={shell.soon}>Soon</span>
          </div>
        ))}
      </div>

      <div className={shell.rowList}>
        <div className={shell.row}>
          <div className={shell.rowText}>
            <b>Render library</b>
            <span>{LIBRARY_READY ? "Layered renders in use." : "Awaiting your layered render export."}</span>
          </div>
          <span className={shell.soon}>{LIBRARY_READY ? "Ready" : "Pending"}</span>
        </div>
        <div className={shell.row}>
          <div className={shell.rowText}>
            <b>Local data</b>
            <span>{count === null ? "—" : `${count} check-in${count === 1 ? "" : "s"} stored on this device.`}</span>
          </div>
          <button
            type="button"
            className={shell.secondaryButton}
            onClick={clearLocalData}
          >
            Clear
          </button>
        </div>
      </div>

      <p className={shell.note}>
        Data stays on your device (localStorage). Nothing is uploaded.
      </p>
    </div>
  );
}

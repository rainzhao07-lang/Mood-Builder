import * as React from "react";

/** Thin progress track. Gold is reserved for stage/progress emphasis. */
export interface ProgressBarProps {
  /** Fill percentage 0–100. */
  value?: number;
  /** Fill color. Default "gold". */
  color?: "gold" | "sage" | "slate";
  style?: React.CSSProperties;
}
export function ProgressBar(props: ProgressBarProps): JSX.Element;

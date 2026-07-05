import * as React from "react";

/**
 * Surface container — the pale panel that groups content on a screen.
 *
 * @startingPoint section="Surfaces" subtitle="Panel card + serif metric" viewport="700x200"
 */
export interface CardProps {
  children: React.ReactNode;
  /** Background tone. Default "default" (panel-300). */
  tone?: "default" | "deep" | "paper";
  /** Elevation. Default "flat". */
  elevation?: "flat" | "raised";
  style?: React.CSSProperties;
}
export function Card(props: CardProps): JSX.Element;

export interface MetricStatProps {
  /** Uppercase key, e.g. "Emotion State". */
  label: string;
  /** Serif value, e.g. "Calm" or 72. */
  value: React.ReactNode;
  /** Optional small unit in accent color, e.g. "ms" or "0.62". */
  unit?: React.ReactNode;
  style?: React.CSSProperties;
}
export function MetricStat(props: MetricStatProps): JSX.Element;

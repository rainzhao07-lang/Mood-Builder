import * as React from "react";

/** Circular self-report control — drag the marker to place an emotional state. */
export interface EmotionWheelProps {
  /** Initial marker x (0–1, left→right). Default 0.38. */
  defaultX?: number;
  /** Initial marker y (0–1, top→bottom). Default 0.42. */
  defaultY?: number;
  /** Fires with the leaning quadrant label and normalized position. */
  onChange?: (label: string, pos: { x: number; y: number }) => void;
}
export function EmotionWheel(props: EmotionWheelProps): JSX.Element;

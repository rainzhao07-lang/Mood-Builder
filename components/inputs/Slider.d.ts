import * as React from "react";

/**
 * Labelled range slider for fine-tuning a generated space.
 *
 * @startingPoint section="Inputs" subtitle="Labelled slider + emotion wheel" viewport="700x260"
 */
export interface SliderProps {
  label: React.ReactNode;
  /** Uncontrolled initial value. Default 50. */
  defaultValue?: number;
  /** Controlled value (supply with onChange). */
  value?: number;
  onChange?: (value: number) => void;
  /** Maps value → display word. Default "percent". */
  mode?: "percent" | "tone" | "layout" | "raw";
  min?: number;
  max?: number;
  /** Override the displayed value entirely. */
  display?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Slider(props: SliderProps): JSX.Element;

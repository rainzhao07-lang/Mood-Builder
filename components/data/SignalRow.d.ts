import * as React from "react";

/** One physiological sensor reading row: label + status tag, serif value. */
export interface SignalRowProps {
  label: React.ReactNode;
  /** Status tint. Default "rest". */
  status?: "rest" | "warn" | "alert";
  /** Status caption beside the dot, e.g. "Stable". */
  statusText?: React.ReactNode;
  value: React.ReactNode;
  unit?: React.ReactNode;
  style?: React.CSSProperties;
}
export function SignalRow(props: SignalRowProps): JSX.Element;

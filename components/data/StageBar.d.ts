import * as React from "react";

/** Stage indicator with gold track — "Stage 2 / 5" plus optional trailing note. */
export interface StageBarProps {
  /** Current stage. Default 2. */
  stage?: number;
  /** Total stages. Default 5. */
  total?: number;
  /** Trailing note, e.g. "+3d". */
  note?: React.ReactNode;
  style?: React.CSSProperties;
}
export function StageBar(props: StageBarProps): JSX.Element;

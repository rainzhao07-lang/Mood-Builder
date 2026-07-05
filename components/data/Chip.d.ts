import * as React from "react";

/** Filter / tag chip. Provide onClick to make it an interactive toggle. */
export interface ChipProps {
  children: React.ReactNode;
  /** Selected = slate fill. Default false. */
  selected?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export function Chip(props: ChipProps): JSX.Element;

import * as React from "react";

/**
 * Primary action button for Mood Builder. Full-width by default (lg/md),
 * used as the single committing action at the bottom of each screen.
 *
 * @startingPoint section="Buttons" subtitle="Primary / ghost / quiet actions" viewport="700x150"
 */
export interface ButtonProps {
  children: React.ReactNode;
  /** Visual style. Default "primary". */
  variant?: "primary" | "secondary" | "solid" | "quiet" | "onDark";
  /** Size. lg = full-width footer action; sm = inline. Default "lg". */
  size?: "lg" | "md" | "sm";
  /** Optional leading icon node. */
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;

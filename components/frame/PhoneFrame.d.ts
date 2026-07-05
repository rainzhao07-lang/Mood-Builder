import * as React from "react";

/** iPhone-style device shell with notch + status bar, used to frame screens. */
export interface PhoneFrameProps {
  children: React.ReactNode;
  /** Screen background (CSS color/gradient). Default paper. */
  screen?: string;
  /** Dark status bar text for immersive screens. */
  dark?: boolean;
  /** Status-bar time. Default "9:41". */
  time?: string;
  style?: React.CSSProperties;
}
export function PhoneFrame(props: PhoneFrameProps): JSX.Element;

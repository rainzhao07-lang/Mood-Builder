import * as React from "react";

/**
 * Displays one emotion-driven spatial render — an isometric "space"
 * (contain) or a full immersive interior photo (cover).
 *
 * @startingPoint section="Media" subtitle="Spatial render tile" viewport="700x200"
 */
export interface SpaceTileProps {
  /** Image URL of the render. */
  src: string;
  alt?: string;
  /** Pixel height of the tile. Default 150. */
  height?: number;
  /** Use object-fit:cover (immersive photos) instead of contain. */
  cover?: boolean;
  /** Small bottom-left caption. */
  caption?: React.ReactNode;
  /** Left meta in the overlay row (e.g. "Captured · Day 14"). */
  metaLeft?: React.ReactNode;
  /** Right meta in the overlay row (e.g. "Calm · 0.62"). */
  metaRight?: React.ReactNode;
  style?: React.CSSProperties;
}
export function SpaceTile(props: SpaceTileProps): JSX.Element;

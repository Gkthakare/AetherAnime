/**
 * WorldLayout — types only.
 *
 * Placement composition. Owns no runtime state.
 */

import type { ReactElement, ReactNode } from 'react';

/** Named regions laid out by the World Layout Engine. */
export type WorldLayoutSlots = {
  identity?: ReactNode;
  presence?: ReactNode;
  primary?: ReactNode;
  secondary?: ReactNode;
};

export type WorldLayoutProps = WorldLayoutSlots & {
  /** Layout composition only. */
  className?: string;
  /** Arrival keeps the destination column; idle is a spatial place. */
  arrived?: boolean;
  /**
   * Optional Shell wrapper around identity + regions (e.g. enter motion).
   * Presence stays outside so atmosphere is not coupled to content enter.
   */
  wrapMain?: (main: ReactElement) => ReactNode;
};

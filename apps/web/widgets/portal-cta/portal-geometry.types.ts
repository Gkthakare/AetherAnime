/**
 * Impossible Threshold geometry — types only.
 */

import type { PortalPhase } from './portal-cta.types';

export interface PortalGeometryProps {
  /** Layout composition only — never for redesigning identity. */
  className?: string;
  /**
   * When true, ambient Living Threshold loops are frozen and phase responses
   * prefer opacity (no continuous transforms).
   */
  reduceMotion?: boolean;
  /**
   * Local PortalPhase from PortalCTA — drives event-driven layer targets.
   * @default "idle"
   */
  phase?: PortalPhase;
}

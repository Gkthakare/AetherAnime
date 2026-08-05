import type { HTMLAttributes } from 'react';

/**
 * Props for the Portal Invitation (PortalCTA).
 *
 * Interaction language: `Enter {destination}`. The verb is constant; only the
 * destination varies. Completion is separable from ceremony — `onComplete`
 * fires after Settling so Arrival (or a future scene) can return to idle or
 * navigate without the portal owning siblings.
 */
export interface PortalCTAProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'> {
  /**
   * Named world in the Anime Operating System.
   * @default "AetherAnime"
   */
  destination?: string;
  /** When true, the invitation cannot be activated. */
  disabled?: boolean;
  /** Fires once when the user commits (Accepting begins). */
  onAccept?: () => void;
  /**
   * Fires once when Settling finishes and the seal returns to Idle.
   * Sprint-002: scene stays on Arrival. Future: swap for navigate.
   */
  onComplete?: () => void;
}

/** Emotional / choreography phases owned by the Magical Seal. */
export type PortalPhase =
  | 'idle'
  | 'inviting'
  | 'accepting'
  | 'crossing'
  | 'settling';

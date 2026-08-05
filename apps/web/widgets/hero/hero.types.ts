import type { ArrivalPhase } from '../arrival-scene/arrival-scene.types';

/**
 * Props for Hero — identity performer on Arrival.
 *
 * Responds only to `ArrivalPhase` from the Experience Director.
 * Does not know Portal, Atmosphere, or any sibling widget.
 */
export interface HeroProps {
  /**
   * Scene emotional phase owned by ArrivalScene.
   * @default "idle"
   */
  phase?: ArrivalPhase;
}

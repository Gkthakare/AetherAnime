import type { HTMLAttributes } from 'react';

import type { ArrivalPhase } from '../arrival-scene/arrival-scene.types';

/**
 * Props for AtmosphereLayer.
 *
 * Environmental presentation only. Subscribes to `ArrivalPhase` from the
 * Experience Director — never imports Portal or Hero. `className` is reserved
 * for layout composition, never for redesigning the atmosphere.
 */
export interface AtmosphereLayerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: never;
  /**
   * Scene emotional phase owned by ArrivalScene.
   * @default "idle"
   */
  phase?: ArrivalPhase;
}

/**
 * Living presence — idle-world breath derived from arrival atmosphere.
 *
 * Active while the traveller has not arrived. Arrival pauses this so
 * TASK-031 owns the beat. Not a store, not Focus, not a route.
 */

import type { WorldArrivalAtmosphere } from './world-arrival.atmosphere';

export type WorldLivingPresence = {
  readonly active: boolean;
  readonly spatial: boolean;
  readonly ariaHidden: true;
};

export type WorldLivingPresenceInput = {
  readonly atmosphere: WorldArrivalAtmosphere;
  readonly reduceMotion: boolean;
};

export function worldLivingPresence(
  input: WorldLivingPresenceInput,
): WorldLivingPresence {
  const active = input.atmosphere.source !== 'arrival';

  return {
    active,
    spatial: active && !input.reduceMotion,
    ariaHidden: true,
  };
}

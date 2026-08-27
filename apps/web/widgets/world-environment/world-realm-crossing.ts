/**
 * Realm crossing — presentation derived from existing arrival atmosphere.
 *
 * Active only when WorldScene has arrivedAnime. Candidates, Focus, and
 * unknown asks never set that, so they never cross. Keyed to the existing
 * slug. Not a store, not Focus, not a route.
 */

import type { WorldClimate } from '@/shared/world';

import type { WorldArrivalAtmosphere } from './world-arrival.atmosphere';

export type WorldRealmCrossing = {
  readonly active: boolean;
  readonly key: string | null;
  readonly climate: WorldClimate | null;
  readonly spatial: boolean;
  readonly ariaHidden: true;
};

export type WorldRealmCrossingInput = {
  readonly atmosphere: WorldArrivalAtmosphere;
  readonly reduceMotion: boolean;
};

export function worldRealmCrossing(
  input: WorldRealmCrossingInput,
): WorldRealmCrossing {
  const active =
    input.atmosphere.source === 'arrival' &&
    input.atmosphere.arrivalKey != null;

  return {
    active,
    key: active ? input.atmosphere.arrivalKey : null,
    climate: active ? input.atmosphere.climate : null,
    spatial: active && !input.reduceMotion,
    ariaHidden: true,
  };
}

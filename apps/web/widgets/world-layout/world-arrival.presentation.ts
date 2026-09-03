/**
 * Arrived-anime composition — placement and chrome emphasis only.
 *
 * Derived from `arrivedAnime` existence. Does not own Focus, navigation,
 * identity authority, or layout breakpoints.
 */

import { spacing } from '@/shared/config/theme';
import {
  isWorldTransportActive,
  type WorldTransportPhase,
} from '@/shared/world/world.transport';

export const WORLD_ARRIVAL_RECEDE = 0.42;

export type WorldArrivalPresentation = {
  readonly destinationInIdentity: boolean;
  readonly kindPresent: boolean;
  readonly detailsPresent: boolean;
  readonly recedeWorldChrome: boolean;
  /** Identity → navigator → destination rhythm. */
  readonly identityGap: string;
};

export type WorldArrivalLayoutGaps = {
  readonly stage: string;
  readonly regions: string;
};

/** Slot intent for the identity-column arrival composition. */
export function worldArrivalPresentation(
  hasArrivedAnime: boolean,
  transportPhase: WorldTransportPhase = 'idle',
): WorldArrivalPresentation {
  const departing = transportPhase === 'departing';
  const showDestination =
    hasArrivedAnime && transportPhase !== 'departing';
  const recedeWorldChrome =
    hasArrivedAnime || isWorldTransportActive(transportPhase);

  return {
    destinationInIdentity: showDestination,
    kindPresent: true,
    detailsPresent: true,
    recedeWorldChrome,
    identityGap: showDestination ? spacing.sm : departing ? spacing.md : spacing.xl,
  };
}

/** Kind / Details stay mounted; arrival only softens their opacity. */
export function worldArrivalChromeOpacity(
  base: number,
  recede: boolean,
): number {
  return recede ? base * WORLD_ARRIVAL_RECEDE : base;
}

/**
 * Stage / region gaps. Idle keeps the sacred 2xl / xl rhythm.
 * Arrival tightens so receded chrome does not open a second page.
 */
export function worldArrivalLayoutGaps(
  recedeWorldChrome: boolean,
): WorldArrivalLayoutGaps {
  if (!recedeWorldChrome) {
    return { stage: spacing['2xl'], regions: spacing.xl };
  }
  return { stage: spacing.sm, regions: spacing.sm };
}

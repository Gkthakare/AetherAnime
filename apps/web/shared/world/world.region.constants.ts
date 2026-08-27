/**
 * World Region — shared constant identifiers.
 */

import type { WorldRegionId } from './world.region.types';

/** AetherAnime — continuum region. */
export const AETHERANIME_REGION_CONTINUUM_ID =
  'world-continuum' as const satisfies WorldRegionId;

/** AetherAnime — future thresholds region. */
export const AETHERANIME_REGION_THRESHOLDS_ID =
  'thresholds-ahead' as const satisfies WorldRegionId;

/** Shell-status structural region — unrecognized destination. */
export const SYSTEM_REGION_AWAITING_KIND_ID =
  'awaiting-kind' as const satisfies WorldRegionId;

/** Shell-status structural region — world not yet open. */
export const SYSTEM_REGION_STAGE_SEALED_ID =
  'stage-sealed' as const satisfies WorldRegionId;

/**
 * Synthetic world id for status-only structural regions.
 * Not a World Registry entry — Region Engine ownership only.
 */
export const SYSTEM_REGION_WORLD_ID = '__system__' as const;

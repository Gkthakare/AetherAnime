/**
 * World Registry — shared constant identifiers.
 *
 * Aligns with existing World Transition destination (`AetherAnime` → `aetheranime`).
 */

import type { WorldId } from './world.types';

/** Platform home world — sole initial registry entry. */
export const AETHERANIME_WORLD_ID = 'aetheranime' as const satisfies WorldId;

/** URL slug shared with `worldHref` / Arrival destination. */
export const AETHERANIME_WORLD_SLUG = 'aetheranime' as const;

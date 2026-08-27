/**
 * World Focus — canonical interaction attention for World Engine.
 *
 * Distinct from Lifecycle (entry), Presence (emotion), and Kind (what).
 * Scene Director owns runtime focus; Kind renders it.
 */

import { SCALE } from '@/shared/lib/motion';

/** Stable id for a focusable world region (not a display label). */
export type WorldFocusRegion = string;

/** No region holds attention. */
export const WORLD_FOCUS_NONE: WorldFocusRegion | null = null;

/**
 * Max scale when a region is focused — composed from Motion Foundation SCALE.
 * SCALE.TO + (1 − SCALE.FROM) / 2 → 1.02.
 */
export const WORLD_FOCUS_SCALE =
  SCALE.TO + (1 - SCALE.FROM) / 2;

export type WorldFocusEvent =
  | { readonly type: 'focus'; readonly region: WorldFocusRegion }
  | { readonly type: 'clear' };

/**
 * Pure focus reducer. Focus changes only through explicit events.
 */
export function reduceWorldFocus(
  _current: WorldFocusRegion | null,
  event: WorldFocusEvent,
): WorldFocusRegion | null {
  switch (event.type) {
    case 'focus':
      return event.region.length > 0 ? event.region : WORLD_FOCUS_NONE;
    case 'clear':
      return WORLD_FOCUS_NONE;
    default: {
      const _exhaustive: never = event;
      return _exhaustive;
    }
  }
}

export function canTransitionWorldFocus(
  current: WorldFocusRegion | null,
  event: WorldFocusEvent,
): boolean {
  return reduceWorldFocus(current, event) !== current;
}

/**
 * World Ambient — derived visual state for World Engine.
 *
 * Pure projection from Lifecycle × Presence × Focus. Owns no runtime,
 * layout, Registry, Portal, Navigation, timers, or rendering.
 * Scene Director computes Ambient; widgets consume it — never re-derive.
 */

import type { WorldFocusRegion } from './world.focus';
import type { WorldLifecycle } from './world.lifecycle';
import type { WorldPresence } from './world.presence';

/** Visual intensity band — not Presence itself. */
export const WORLD_AMBIENT_LEVELS = [
  'quiet',
  'welcoming',
  'focused',
  'celebrating',
  'sleeping',
] as const;

export type WorldAmbientLevel = (typeof WORLD_AMBIENT_LEVELS)[number];

/** Soft Aether color emphasis — not Registry climate. */
export const WORLD_AMBIENT_VARIANTS = [
  'calm',
  'dream',
  'mystic',
  'energetic',
  'unknown',
] as const;

export type WorldAmbientVariant = (typeof WORLD_AMBIENT_VARIANTS)[number];

/** Canonical derived ambient snapshot. */
export type WorldAmbient = {
  readonly level: WorldAmbientLevel;
  readonly variant: WorldAmbientVariant;
};

export type ResolveWorldAmbientInput = {
  readonly lifecycle: WorldLifecycle;
  readonly presence: WorldPresence;
  readonly focusedRegion: WorldFocusRegion | null;
};

/**
 * Derive ambient level from canonical runtimes.
 * Precedence: exit dimming → celebration → sleep → focus → welcome → quiet.
 */
function resolveWorldAmbientLevel(
  lifecycle: WorldLifecycle,
  presence: WorldPresence,
  focusedRegion: WorldFocusRegion | null,
): WorldAmbientLevel {
  if (lifecycle === 'released' || lifecycle === 'yielding') {
    return 'sleeping';
  }
  if (presence === 'celebrating') return 'celebrating';
  if (presence === 'sleeping') return 'sleeping';
  if (focusedRegion != null || presence === 'focused') return 'focused';
  if (presence === 'welcoming' || presence === 'awakening') {
    return 'welcoming';
  }
  return 'quiet';
}

/**
 * Derive ambient variant (gradient / accent emphasis).
 * Unknown presence stays unknown; focus tilts mystic.
 */
function resolveWorldAmbientVariant(
  presence: WorldPresence,
  focusedRegion: WorldFocusRegion | null,
): WorldAmbientVariant {
  if (presence === 'unknown') return 'unknown';
  if (presence === 'celebrating') return 'energetic';
  if (focusedRegion != null || presence === 'focused') return 'mystic';
  if (presence === 'welcoming' || presence === 'awakening') return 'dream';
  return 'calm';
}

/** Canonical Ambient Director — pure, synchronous. */
export function resolveWorldAmbient(
  input: ResolveWorldAmbientInput,
): WorldAmbient {
  return {
    level: resolveWorldAmbientLevel(
      input.lifecycle,
      input.presence,
      input.focusedRegion,
    ),
    variant: resolveWorldAmbientVariant(
      input.presence,
      input.focusedRegion,
    ),
  };
}

/**
 * Soft intensity for opacity / accent consumers.
 * Clamp opacity channels to ≤ 1.
 */
export function worldAmbientIntensity(ambient: WorldAmbient): number {
  switch (ambient.level) {
    case 'quiet':
      return 0.82;
    case 'welcoming':
      return 1.05;
    case 'focused':
      return 1;
    case 'celebrating':
      return 1.12;
    case 'sleeping':
      return 0.5;
    default: {
      const _exhaustive: never = ambient.level;
      return _exhaustive;
    }
  }
}

/** Default ambient for a quiet present world with no focus. */
export const WORLD_AMBIENT_DEFAULT: WorldAmbient = {
  level: 'quiet',
  variant: 'calm',
};

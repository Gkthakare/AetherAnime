/**
 * World Presence — canonical emotional state for a world.
 *
 * Distinct from World Lifecycle (entry progression). Presence is how the world
 * feels; Lifecycle is where entry sits. Scene Director owns runtime Presence.
 */

/** Emotional presence states — not PortalPhase, not Lifecycle. */
export const WORLD_PRESENCES = [
  'quiet',
  'awakening',
  'welcoming',
  'focused',
  'celebrating',
  'sleeping',
  'unknown',
] as const;

export type WorldPresence = (typeof WORLD_PRESENCES)[number];

/**
 * Presence events the Scene Director may dispatch.
 * Free emotional set — no timers; invalid names never apply.
 */
export type WorldPresenceEvent =
  | 'quiet'
  | 'awaken'
  | 'welcome'
  | 'focus'
  | 'celebrate'
  | 'sleep'
  | 'unknown'
  | 'reset';

const EVENT_TO_PRESENCE: Record<
  Exclude<WorldPresenceEvent, 'reset'>,
  WorldPresence
> = {
  quiet: 'quiet',
  awaken: 'awakening',
  welcome: 'welcoming',
  focus: 'focused',
  celebrate: 'celebrating',
  sleep: 'sleeping',
  unknown: 'unknown',
};

/**
 * Pure presence reducer. Any emotional event may replace the current feel;
 * `reset` returns to quiet (registered default).
 */
export function reduceWorldPresence(
  _current: WorldPresence,
  event: WorldPresenceEvent,
): WorldPresence {
  if (event === 'reset') return 'quiet';
  return EVENT_TO_PRESENCE[event];
}

export function canTransitionWorldPresence(
  current: WorldPresence,
  event: WorldPresenceEvent,
): boolean {
  return reduceWorldPresence(current, event) !== current;
}

/** Default for registered worlds. */
export const WORLD_PRESENCE_DEFAULT: WorldPresence = 'quiet';

/** Default for unresolved destinations. */
export const WORLD_PRESENCE_UNKNOWN: WorldPresence = 'unknown';

/**
 * Initial presence from shell status — no Registry lookup.
 * Registered / comingSoon → quiet; unknown → unknown.
 */
export function initialWorldPresence(
  status: 'valid' | 'unknown' | 'comingSoon',
): WorldPresence {
  return status === 'unknown' ? WORLD_PRESENCE_UNKNOWN : WORLD_PRESENCE_DEFAULT;
}

/**
 * World Lifecycle — canonical phases and pure transitions.
 *
 * Belongs to World Engine only. Distinct from PortalPhase / ArrivalPhase.
 * Scene Director owns runtime phase; this module is the single transition table.
 *
 * Canon: `docs/design/WORLD_ENGINE.md` §5.
 */

/** Ordered World Engine lifecycle (not PortalPhase). */
export const WORLD_LIFECYCLES = [
  'pendingEntry',
  'receiving',
  'present',
  'engaged',
  'yielding',
  'released',
] as const;

export type WorldLifecycle = (typeof WORLD_LIFECYCLES)[number];

/**
 * Lifecycle events the Scene Director may dispatch.
 * No timers — callers advance intentionally.
 */
export type WorldLifecycleEvent =
  | 'receive'
  | 'present'
  | 'engage'
  | 'yield'
  | 'release'
  | 'reset';

const LOCKED: ReadonlySet<WorldLifecycle> = new Set(['released']);

/** True when the world still owns presence (not Released). */
export function isWorldLifecycleActive(phase: WorldLifecycle): boolean {
  return !LOCKED.has(phase);
}

/**
 * Pure lifecycle reducer — single transition table for all World features.
 * Invalid events leave the phase unchanged.
 */
export function reduceWorldLifecycle(
  phase: WorldLifecycle,
  event: WorldLifecycleEvent,
): WorldLifecycle {
  switch (event) {
    case 'receive':
      return phase === 'pendingEntry' ? 'receiving' : phase;
    case 'present':
      return phase === 'receiving' || phase === 'engaged' ? 'present' : phase;
    case 'engage':
      return phase === 'present' ? 'engaged' : phase;
    case 'yield':
      return phase === 'present' || phase === 'engaged' ? 'yielding' : phase;
    case 'release':
      return phase === 'yielding' ? 'released' : phase;
    case 'reset':
      return 'present';
    default: {
      const _exhaustive: never = event;
      return _exhaustive;
    }
  }
}

/** Whether an event would change the current phase. */
export function canTransitionWorldLifecycle(
  phase: WorldLifecycle,
  event: WorldLifecycleEvent,
): boolean {
  return reduceWorldLifecycle(phase, event) !== phase;
}

/**
 * Default phase once WorldScene has mounted with resolved identity.
 * PendingEntry / Receiving remain available via dispatch for future handoff.
 */
export const WORLD_LIFECYCLE_DEFAULT: WorldLifecycle = 'present';

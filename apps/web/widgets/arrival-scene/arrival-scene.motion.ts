/**
 * ArrivalScene orchestration contract + ceremony event schedule.
 *
 * Owns lifecycle transitions and performer intent per ArrivalPhase.
 * Does NOT import Framer Motion or describe how performers animate.
 *
 * Choreography plugs in by:
 * 1. Dispatching lifecycle events via `reduceArrivalPhase` (Director), then
 * 2. Performers reading `ArrivalPhase` / `ARRIVAL_ORCHESTRATION` locally.
 *
 * Sequence dwells reuse the Motion Foundation ceremony clock — the same values
 * Portal's accept sequence reads — so ceremony stays in sync without importing
 * Portal.
 */

import { wait } from '@/shared/lib/async';
import {
  CEREMONY_SEQUENCE,
  CEREMONY_SEQUENCE_REDUCED,
  isCeremonyPhase,
} from '@/shared/lib/motion';

import type {
  ArrivalOrchestrationFrame,
  ArrivalPhase,
  ArrivalPhaseEvent,
} from './arrival-scene.types';

/** Canonical phase order for the emotional journey (Idle closes the loop). */
export const ARRIVAL_PHASE_ORDER = [
  'idle',
  'aware',
  'inviting',
  'accepting',
  'crossing',
  'settling',
] as const satisfies ReadonlyArray<ArrivalPhase>;

/** True while the invitation ceremony is committed and must not restart. */
export function isArrivalLocked(phase: ArrivalPhase): boolean {
  return isCeremonyPhase(phase);
}

/**
 * Pure lifecycle reducer — the Director's transition table.
 *
 * Invalid or out-of-order events leave the current phase unchanged
 * (except `complete`, which always returns to Idle).
 */
export function reduceArrivalPhase(
  phase: ArrivalPhase,
  event: ArrivalPhaseEvent,
): ArrivalPhase {
  switch (event) {
    case 'notice':
      return phase === 'idle' ? 'aware' : phase;
    case 'invite':
      return phase === 'idle' || phase === 'aware' ? 'inviting' : phase;
    case 'accept':
      if (isArrivalLocked(phase)) return phase;
      return 'accepting';
    case 'cross':
      return phase === 'accepting' ? 'crossing' : phase;
    case 'settle':
      return phase === 'crossing' ? 'settling' : phase;
    case 'complete':
      return 'idle';
    default: {
      const _exhaustive: never = event;
      return _exhaustive;
    }
  }
}

/**
 * Semantic orchestration frame per phase.
 *
 * Portal leads; Atmosphere echoes; Hero acknowledges — matching
 * PORTAL_INVITATION motion language. Values are intents, not keyframes.
 */
export const ARRIVAL_ORCHESTRATION: Record<
  ArrivalPhase,
  ArrivalOrchestrationFrame
> = {
  idle: {
    portal: { intent: 'Calm seal presence; invitation exists without insisting.' },
    hero: { intent: 'Identity at rest; brand signal steady.' },
    atmosphere: { intent: 'Soft Aether at rest; quiet environmental life.' },
  },
  aware: {
    portal: { intent: 'Recognition only — noticed, not yet inviting.' },
    hero: { intent: 'No change; identity holds.' },
    atmosphere: { intent: 'No change; environment holds.' },
  },
  inviting: {
    portal: { intent: 'Acknowledge user; light gathers; destination addressable.' },
    hero: { intent: 'Optional later hint the world is listening — never steal focus.' },
    atmosphere: { intent: 'Optional later hint — restrained, seal remains primary.' },
  },
  accepting: {
    portal: { intent: 'Primary actor; commitment locked; ceremony begins.' },
    hero: { intent: 'Prepare to acknowledge; do not lead.' },
    atmosphere: { intent: 'Prepare to respond; do not lead.' },
  },
  crossing: {
    portal: { intent: 'Perform enter gesture; threshold opens.' },
    hero: { intent: 'Acknowledge — soft bow; yield focus to entering.' },
    atmosphere: { intent: 'Environmental echo after portal leads (cascade).' },
  },
  settling: {
    portal: { intent: 'Close into calm presence.' },
    hero: { intent: 'Return to resting identity.' },
    atmosphere: { intent: 'Return to resting Soft Aether.' },
  },
};

/** Look up the semantic frame for a phase. */
export function getArrivalOrchestration(
  phase: ArrivalPhase,
): ArrivalOrchestrationFrame {
  return ARRIVAL_ORCHESTRATION[phase];
}

/**
 * Dwell before dispatching the *next* lifecycle event after entering a phase.
 * Shares the foundation's ceremony clock with Portal (short Crossing, longer
 * Settling) so neither side owns the other's timing.
 */
export const ARRIVAL_SEQUENCE = CEREMONY_SEQUENCE;

/** Same emotional beats; shortened dwells when reduced motion is preferred. */
export const ARRIVAL_SEQUENCE_REDUCED = CEREMONY_SEQUENCE_REDUCED;

export type ArrivalCeremonyDispatch = (event: ArrivalPhaseEvent) => void;

/**
 * Dispatch the accept → cross → settle event chain.
 *
 * This is an event schedule for the reducer — not an animation timeline.
 * Visual motion lives only in performers reading `ArrivalPhase`.
 *
 * Settling is entered here; Settling *ends* when Portal fires `onComplete`
 * (`complete`) so Portal and Director share one exhale — the Director does
 * not run a second settling timer after `settle`.
 */
export async function dispatchArrivalCeremony(
  dispatch: ArrivalCeremonyDispatch,
  options: { reducedMotion: boolean; signal?: AbortSignal },
): Promise<void> {
  const sequence = options.reducedMotion
    ? ARRIVAL_SEQUENCE_REDUCED
    : ARRIVAL_SEQUENCE;

  dispatch('accept');
  await wait(sequence.accepting, options.signal);

  dispatch('cross');
  await wait(sequence.crossing, options.signal);

  dispatch('settle');
}

/** Whether a phase should drive Hero / Atmosphere ceremony responses. */
export function isArrivalCeremonyPhase(phase: ArrivalPhase): boolean {
  return isCeremonyPhase(phase);
}

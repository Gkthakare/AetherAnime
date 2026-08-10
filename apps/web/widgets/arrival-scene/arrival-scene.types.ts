/**
 * ArrivalScene orchestration types — the Experience Director contract.
 *
 * `ArrivalPhase` is the canonical scene lifecycle from
 * `docs/design/PORTAL_INVITATION.md`. The Director owns this phase;
 * performers (PortalCTA, Hero, Atmosphere) never share state sideways.
 *
 * This module defines types only. It does not animate, time, or style.
 */

/**
 * Canonical Arrival emotional lifecycle.
 *
 * ```
 * Idle → Aware → Inviting → Accepting → Crossing → Settling → Idle
 * ```
 *
 * - **idle** — World at rest. Soft Aether lives quietly. Seal calm.
 *   Readiness without urgency.
 * - **aware** — User notices the portal. Recognition only; no invitation yet.
 * - **inviting** — Portal acknowledges the user. Light gathers. Permission.
 * - **accepting** — User commits. Irreversible beat. Interaction locks.
 * - **crossing** — Threshold opens. Seal leads; world responds in cascade.
 * - **settling** — Surge resolves into afterglow; then Idle or World Transition.
 *
 * Completion consequence is separable: Director may navigate after Settling
 * without renaming these phases.
 */
export type ArrivalPhase =
  | 'idle'
  | 'aware'
  | 'inviting'
  | 'accepting'
  | 'crossing'
  | 'settling';

/**
 * Lifecycle events the Director accepts.
 *
 * Performers report intent through the Director (today: Portal via
 * `onAccept` / `onComplete`). They never call each other.
 *
 * | Event       | Intent                                                         |
 * | ----------- | -------------------------------------------------------------- |
 * | `notice`    | User notices the threshold (gaze / proximity / focus lead-in)  |
 * | `invite`    | Portal acknowledges the user                                   |
 * | `accept`    | User commits — Accepting begins                                |
 * | `cross`     | Threshold opens — Crossing begins                              |
 * | `settle`    | Surge resolves — Settling begins                               |
 * | `complete`  | Ceremony finished — Idle + optional World Transition     |
 */
export type ArrivalPhaseEvent =
  | 'notice'
  | 'invite'
  | 'accept'
  | 'cross'
  | 'settle'
  | 'complete';

/**
 * Named performers on the Arrival stage.
 *
 * Future choreography addresses performers through the Director + phase,
 * never through sibling imports between widgets.
 */
export type ArrivalPerformer = 'portal' | 'hero' | 'atmosphere';

/**
 * Semantic directive for a single performer in a given phase.
 * Future motion modules map these intents to local animation — never here.
 */
export type ArrivalPerformerDirective = {
  /** What this performer should express in the current phase. */
  intent: string;
};

/**
 * Full scene orchestration snapshot for one ArrivalPhase.
 * Contract only — no durations, easings, or motion values.
 */
export type ArrivalOrchestrationFrame = Record<
  ArrivalPerformer,
  ArrivalPerformerDirective
>;

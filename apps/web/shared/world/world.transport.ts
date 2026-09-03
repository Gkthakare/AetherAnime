/**
 * World transport — anime destination ceremony phases.
 *
 * Distinct from WorldLifecycle (engine presence) and PortalPhase (Home).
 * Scene Director owns runtime phase; this module is the transition table
 * and schedule for Navigator-initiated anime travel.
 */

import { DURATION } from '@/shared/lib/motion';

export const WORLD_TRANSPORT_PHASES = [
  'idle',
  'departing',
  'in_transit',
  'arriving',
] as const;

export type WorldTransportPhase = (typeof WORLD_TRANSPORT_PHASES)[number];

export type WorldTransportEvent =
  | 'depart'
  | 'transit'
  | 'arrive'
  | 'settle'
  | 'abort';

/** Departure dwell before transit/crossing begins (~300–400ms). */
export const WORLD_TRANSPORT_DEPART_S = 0.35;

/** Fraction of cinematic transit elapsed before URL commit (transit midpoint). */
export const WORLD_TRANSPORT_URL_COMMIT_FRACTION = 0.5;

/** TASK-096 warp ceremony. Lifecycle is unchanged: DEPART→TRANSIT→URL→ARRIVE. */
export const WORLD_TRANSPORT_CINEMATIC_S = DURATION.WARP;

const LOCKED: ReadonlySet<WorldTransportPhase> = new Set([
  'departing',
  'in_transit',
  'arriving',
]);

export function isWorldTransportLocked(phase: WorldTransportPhase): boolean {
  return LOCKED.has(phase);
}

export function isWorldTransportActive(phase: WorldTransportPhase): boolean {
  return phase !== 'idle';
}

export function reduceWorldTransport(
  phase: WorldTransportPhase,
  event: WorldTransportEvent,
): WorldTransportPhase {
  switch (event) {
    case 'depart':
      return phase === 'idle' ? 'departing' : phase;
    case 'transit':
      return phase === 'departing' ? 'in_transit' : phase;
    case 'arrive':
      return phase === 'in_transit' ? 'arriving' : phase;
    case 'settle':
      return phase === 'arriving' ? 'idle' : phase;
    case 'abort':
      return 'idle';
    default: {
      const _exhaustive: never = event;
      return _exhaustive;
    }
  }
}

export type WorldTransportSchedule = {
  readonly departS: number;
  readonly urlCommitS: number;
  readonly arriveS: number;
  readonly totalS: number;
};

/** Ceremony timing for a Navigator-initiated anime transport. */
export function worldTransportSchedule(
  reducedMotion: boolean,
): WorldTransportSchedule {
  if (reducedMotion) {
    return {
      departS: 0,
      urlCommitS: 0,
      arriveS: 0,
      totalS: 0,
    };
  }

  const departS = WORLD_TRANSPORT_DEPART_S;
  const urlCommitS =
    departS + WORLD_TRANSPORT_CINEMATIC_S * WORLD_TRANSPORT_URL_COMMIT_FRACTION;
  const totalS = departS + WORLD_TRANSPORT_CINEMATIC_S;
  const arriveS = urlCommitS;

  return { departS, urlCommitS, arriveS, totalS };
}

export type WorldTransportCallbacks = {
  readonly onDepart: () => void;
  readonly onTransit: () => void;
  readonly onUrlCommit: () => void;
  readonly onArrive: () => void;
  readonly onSettle: () => void;
};

function wait(seconds: number, signal?: AbortSignal): Promise<void> {
  if (seconds <= 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const id = setTimeout(() => resolve(), seconds * 1000);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(id);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true },
    );
  });
}

/**
 * Run the World → Anime transport ceremony.
 *
 * Callback order: depart → (dwell) → transit → (mid-transit) url → arrive → settle.
 */
export async function runWorldAnimeTransport(
  callbacks: WorldTransportCallbacks,
  options: { reducedMotion: boolean; signal?: AbortSignal },
): Promise<void> {
  const schedule = worldTransportSchedule(options.reducedMotion);

  callbacks.onDepart();
  await wait(schedule.departS, options.signal);

  callbacks.onTransit();
  await wait(schedule.urlCommitS - schedule.departS, options.signal);

  callbacks.onUrlCommit();
  callbacks.onArrive();
  await wait(schedule.totalS - schedule.urlCommitS, options.signal);

  callbacks.onSettle();
}

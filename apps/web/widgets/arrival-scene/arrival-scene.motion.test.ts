import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DURATION } from '@/shared/lib/motion';

import {
  ARRIVAL_ORCHESTRATION,
  ARRIVAL_PHASE_ORDER,
  ARRIVAL_SEQUENCE,
  ARRIVAL_SEQUENCE_REDUCED,
  dispatchArrivalCeremony,
  getArrivalOrchestration,
  isArrivalCeremonyPhase,
  isArrivalLocked,
  reduceArrivalPhase,
} from './arrival-scene.motion';
import type { ArrivalPhase, ArrivalPhaseEvent } from './arrival-scene.types';

const ALL_PHASES = ARRIVAL_PHASE_ORDER;
const ALL_EVENTS: readonly ArrivalPhaseEvent[] = [
  'notice',
  'invite',
  'accept',
  'cross',
  'settle',
  'complete',
];

describe('ARRIVAL_PHASE_ORDER', () => {
  it('describes the canonical emotional journey', () => {
    expect(ARRIVAL_PHASE_ORDER).toEqual([
      'idle',
      'aware',
      'inviting',
      'accepting',
      'crossing',
      'settling',
    ]);
  });
});

describe('isArrivalLocked', () => {
  it('locks the ceremony from accepting through settling', () => {
    expect(isArrivalLocked('accepting')).toBe(true);
    expect(isArrivalLocked('crossing')).toBe(true);
    expect(isArrivalLocked('settling')).toBe(true);
  });

  it('leaves pre-commitment phases unlocked', () => {
    expect(isArrivalLocked('idle')).toBe(false);
    expect(isArrivalLocked('aware')).toBe(false);
    expect(isArrivalLocked('inviting')).toBe(false);
  });
});

describe('reduceArrivalPhase', () => {
  it('walks the happy path through the full lifecycle', () => {
    let phase: ArrivalPhase = 'idle';
    phase = reduceArrivalPhase(phase, 'notice');
    expect(phase).toBe('aware');
    phase = reduceArrivalPhase(phase, 'invite');
    expect(phase).toBe('inviting');
    phase = reduceArrivalPhase(phase, 'accept');
    expect(phase).toBe('accepting');
    phase = reduceArrivalPhase(phase, 'cross');
    expect(phase).toBe('crossing');
    phase = reduceArrivalPhase(phase, 'settle');
    expect(phase).toBe('settling');
    phase = reduceArrivalPhase(phase, 'complete');
    expect(phase).toBe('idle');
  });

  it('only notices from idle', () => {
    expect(reduceArrivalPhase('idle', 'notice')).toBe('aware');
    for (const phase of ALL_PHASES.filter((p) => p !== 'idle')) {
      expect(reduceArrivalPhase(phase, 'notice')).toBe(phase);
    }
  });

  it('invites from idle or aware only', () => {
    expect(reduceArrivalPhase('idle', 'invite')).toBe('inviting');
    expect(reduceArrivalPhase('aware', 'invite')).toBe('inviting');
    for (const phase of [
      'inviting',
      'accepting',
      'crossing',
      'settling',
    ] as const) {
      expect(reduceArrivalPhase(phase, 'invite')).toBe(phase);
    }
  });

  it('accepts from any unlocked phase and ignores accept once locked', () => {
    for (const phase of ['idle', 'aware', 'inviting'] as const) {
      expect(reduceArrivalPhase(phase, 'accept')).toBe('accepting');
    }
    for (const phase of ['accepting', 'crossing', 'settling'] as const) {
      expect(reduceArrivalPhase(phase, 'accept')).toBe(phase);
    }
  });

  it('advances the ceremony only in order', () => {
    expect(reduceArrivalPhase('accepting', 'cross')).toBe('crossing');
    expect(reduceArrivalPhase('crossing', 'settle')).toBe('settling');
    for (const phase of ALL_PHASES.filter((p) => p !== 'accepting')) {
      expect(reduceArrivalPhase(phase, 'cross')).toBe(phase);
    }
    for (const phase of ALL_PHASES.filter((p) => p !== 'crossing')) {
      expect(reduceArrivalPhase(phase, 'settle')).toBe(phase);
    }
  });

  it('always returns to idle on complete', () => {
    for (const phase of ALL_PHASES) {
      expect(reduceArrivalPhase(phase, 'complete')).toBe('idle');
    }
  });

  it('never leaves the canonical phase set', () => {
    for (const phase of ALL_PHASES) {
      for (const event of ALL_EVENTS) {
        expect(ALL_PHASES).toContain(reduceArrivalPhase(phase, event));
      }
    }
  });
});

describe('ARRIVAL_ORCHESTRATION', () => {
  it('directs all three performers in every phase', () => {
    for (const phase of ALL_PHASES) {
      const frame = ARRIVAL_ORCHESTRATION[phase];
      expect(Object.keys(frame).sort()).toEqual([
        'atmosphere',
        'hero',
        'portal',
      ]);
      for (const performer of Object.values(frame)) {
        expect(performer.intent.length).toBeGreaterThan(0);
      }
    }
  });

  it('looks up the same frame through the accessor', () => {
    for (const phase of ALL_PHASES) {
      expect(getArrivalOrchestration(phase)).toBe(ARRIVAL_ORCHESTRATION[phase]);
    }
  });

  it('stays semantic — no keyframes, durations, or easings', () => {
    const serialized = JSON.stringify(ARRIVAL_ORCHESTRATION);
    expect(serialized).not.toContain('duration');
    expect(serialized).not.toContain('ease');
    expect(serialized).not.toContain('opacity');
  });
});

describe('ceremony dwells', () => {
  it('composes dwells from motion foundation durations', () => {
    expect(ARRIVAL_SEQUENCE).toEqual({
      accepting: DURATION.NORMAL,
      crossing: DURATION.NORMAL,
      settling: DURATION.CINEMATIC,
    });
  });

  it('shortens every dwell under reduced motion', () => {
    for (const phase of ['accepting', 'crossing', 'settling'] as const) {
      expect(ARRIVAL_SEQUENCE_REDUCED[phase]).toBeLessThan(
        ARRIVAL_SEQUENCE[phase],
      );
    }
  });

  it('keeps settling the longest beat in both modes', () => {
    expect(ARRIVAL_SEQUENCE.settling).toBeGreaterThan(
      ARRIVAL_SEQUENCE.crossing,
    );
    expect(ARRIVAL_SEQUENCE_REDUCED.settling).toBeGreaterThan(
      ARRIVAL_SEQUENCE_REDUCED.crossing,
    );
  });
});

describe('dispatchArrivalCeremony', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('dispatches accept → cross → settle on the full-motion clock', async () => {
    const dispatch = vi.fn();
    const run = dispatchArrivalCeremony(dispatch, { reducedMotion: false });

    expect(dispatch.mock.calls).toEqual([['accept']]);

    await vi.advanceTimersByTimeAsync(ARRIVAL_SEQUENCE.accepting * 1000);
    expect(dispatch.mock.calls).toEqual([['accept'], ['cross']]);

    await vi.advanceTimersByTimeAsync(ARRIVAL_SEQUENCE.crossing * 1000);
    expect(dispatch.mock.calls).toEqual([['accept'], ['cross'], ['settle']]);

    await run;
  });

  it('never dispatches complete — settling ends when the portal exhales', async () => {
    const dispatch = vi.fn();
    const run = dispatchArrivalCeremony(dispatch, { reducedMotion: false });
    await vi.advanceTimersByTimeAsync(10_000);
    await run;
    expect(dispatch.mock.calls.flat()).not.toContain('complete');
  });

  it('uses the shortened dwells under reduced motion', async () => {
    const dispatch = vi.fn();
    const run = dispatchArrivalCeremony(dispatch, { reducedMotion: true });

    await vi.advanceTimersByTimeAsync(
      ARRIVAL_SEQUENCE_REDUCED.accepting * 1000,
    );
    expect(dispatch).toHaveBeenLastCalledWith('cross');

    await vi.advanceTimersByTimeAsync(ARRIVAL_SEQUENCE_REDUCED.crossing * 1000);
    expect(dispatch).toHaveBeenLastCalledWith('settle');

    await run;
  });

  it('aborts mid-ceremony without dispatching later events', async () => {
    const dispatch = vi.fn();
    const controller = new AbortController();
    const run = dispatchArrivalCeremony(dispatch, {
      reducedMotion: false,
      signal: controller.signal,
    });

    controller.abort();
    await expect(run).rejects.toThrow(/Aborted/);
    await vi.advanceTimersByTimeAsync(10_000);
    expect(dispatch.mock.calls).toEqual([['accept']]);
  });

  it('rejects immediately when the signal is already aborted', async () => {
    const dispatch = vi.fn();
    const controller = new AbortController();
    controller.abort();

    await expect(
      dispatchArrivalCeremony(dispatch, {
        reducedMotion: false,
        signal: controller.signal,
      }),
    ).rejects.toThrow(/Aborted/);
    expect(dispatch.mock.calls).toEqual([['accept']]);
  });
});

describe('isArrivalCeremonyPhase', () => {
  it('is true exactly for the locked ceremony phases', () => {
    for (const phase of ALL_PHASES) {
      expect(isArrivalCeremonyPhase(phase)).toBe(isArrivalLocked(phase));
    }
  });
});

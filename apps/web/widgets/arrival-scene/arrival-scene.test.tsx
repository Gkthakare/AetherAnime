// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ARRIVAL_SEQUENCE } from './arrival-scene.motion';
import { ArrivalScene } from './arrival-scene';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

async function advance(seconds: number): Promise<void> {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(seconds * 1000);
  });
}

function scene(): HTMLElement {
  const element = document.querySelector('[data-slot="arrival-scene"]');
  if (!element) throw new Error('ArrivalScene did not render');
  return element as HTMLElement;
}

function phase(): string | null {
  return scene().getAttribute('data-phase');
}

/** Full ceremony duration on the director's clock. */
const CEREMONY =
  ARRIVAL_SEQUENCE.accepting +
  ARRIVAL_SEQUENCE.crossing +
  ARRIVAL_SEQUENCE.settling;

beforeEach(() => {
  push.mockClear();
  vi.useFakeTimers();
  render(<ArrivalScene />);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('ArrivalScene', () => {
  it('opens at rest with hero, atmosphere, and the invitation on stage', () => {
    expect(phase()).toBe('idle');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'AetherAnime',
    );
    expect(screen.getByRole('button').textContent).toContain(
      'Enter AetherAnime',
    );
    expect(
      document.querySelector('[data-slot="atmosphere-layer"]'),
    ).not.toBeNull();
  });

  it('drives every performer from the director phase', () => {
    fireEvent.click(screen.getByRole('button'));
    expect(phase()).toBe('accepting');
    expect(
      document.querySelector('[data-slot="hero"]')?.getAttribute('data-phase'),
    ).toBe('accepting');
  });

  it('advances the ceremony on the director clock and returns to idle', async () => {
    fireEvent.click(screen.getByRole('button'));
    expect(phase()).toBe('accepting');

    await advance(ARRIVAL_SEQUENCE.accepting);
    expect(phase()).toBe('crossing');

    await advance(ARRIVAL_SEQUENCE.crossing);
    expect(phase()).toBe('settling');

    await advance(ARRIVAL_SEQUENCE.settling);
    expect(phase()).toBe('idle');
  });

  it('navigates to the world only after settling completes', async () => {
    fireEvent.click(screen.getByRole('button'));

    await advance(ARRIVAL_SEQUENCE.accepting + ARRIVAL_SEQUENCE.crossing);
    expect(push).not.toHaveBeenCalled();

    await advance(ARRIVAL_SEQUENCE.settling);
    expect(push).toHaveBeenCalledExactlyOnceWith('/world/aetheranime');
  });

  it('never navigates twice for one ceremony', async () => {
    fireEvent.click(screen.getByRole('button'));
    await advance(CEREMONY + 5);
    expect(push).toHaveBeenCalledTimes(1);
  });

  it('ignores activations while the ceremony is locked', async () => {
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));
    await advance(ARRIVAL_SEQUENCE.accepting);
    expect(phase()).toBe('crossing');

    await advance(ARRIVAL_SEQUENCE.crossing + ARRIVAL_SEQUENCE.settling);
    expect(push).toHaveBeenCalledTimes(1);
  });

  it('keeps the scroll indicator inert until it is implemented', () => {
    const indicator = document.querySelector('[data-slot="scroll-indicator"]');
    expect(indicator?.getAttribute('aria-hidden')).toBe('true');
    expect(indicator?.className).toContain('pointer-events-none');
  });
});

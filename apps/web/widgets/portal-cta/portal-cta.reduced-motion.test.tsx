// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PORTAL_SEQUENCE, PORTAL_SEQUENCE_REDUCED } from './portal-cta.motion';
import { PortalCTA } from './portal-cta';

/**
 * Reduced motion lives in its own file: framer-motion reads the media query
 * once per module registry, and Vitest isolates that per test file.
 */
beforeEach(() => {
  window.matchMedia = ((query: string) =>
    ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList) as typeof window.matchMedia;
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

async function advance(seconds: number): Promise<void> {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(seconds * 1000);
  });
}

describe('PortalCTA under prefers-reduced-motion', () => {
  it('runs the ceremony on the abbreviated clock', async () => {
    const onComplete = vi.fn();
    render(<PortalCTA onComplete={onComplete} />);
    const portal = screen.getByRole('button');

    fireEvent.click(portal);
    expect(portal.getAttribute('data-phase')).toBe('accepting');

    await advance(PORTAL_SEQUENCE_REDUCED.accepting);
    expect(portal.getAttribute('data-phase')).toBe('crossing');

    await advance(PORTAL_SEQUENCE_REDUCED.crossing);
    expect(portal.getAttribute('data-phase')).toBe('settling');

    await advance(PORTAL_SEQUENCE_REDUCED.settling);
    expect(portal.getAttribute('data-phase')).toBe('idle');
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('completes the ceremony before the full-motion clock would', async () => {
    const onComplete = vi.fn();
    render(<PortalCTA onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button'));
    await advance(
      PORTAL_SEQUENCE.accepting +
        PORTAL_SEQUENCE.crossing +
        PORTAL_SEQUENCE.settling -
        0.01,
    );
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('still preserves the emotional beats — every phase is entered in order', async () => {
    const seen: string[] = [];
    render(<PortalCTA />);
    const portal = screen.getByRole('button');

    fireEvent.click(portal);
    seen.push(portal.getAttribute('data-phase') as string);
    for (const dwell of [
      PORTAL_SEQUENCE_REDUCED.accepting,
      PORTAL_SEQUENCE_REDUCED.crossing,
      PORTAL_SEQUENCE_REDUCED.settling,
    ]) {
      await advance(dwell);
      seen.push(portal.getAttribute('data-phase') as string);
    }

    expect(seen).toEqual(['accepting', 'crossing', 'settling', 'idle']);
  });
});

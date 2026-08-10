// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PORTAL_SEQUENCE } from './portal-cta.motion';
import { PortalCTA } from './portal-cta';

/** Advance the ceremony clock inside React's act queue. */
async function advance(seconds: number): Promise<void> {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(seconds * 1000);
  });
}

function portal(): HTMLElement {
  return screen.getByRole('button');
}

function phase(): string | null {
  return portal().getAttribute('data-phase');
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('PortalCTA', () => {
  it('invites with a constant verb and the given destination', () => {
    render(<PortalCTA destination="Hidden Leaf Village" />);
    expect(portal().textContent).toContain('Enter Hidden Leaf Village');
  });

  it('defaults the destination to AetherAnime', () => {
    render(<PortalCTA />);
    expect(portal().textContent).toContain('Enter AetherAnime');
  });

  it('rests in idle and is not busy', () => {
    render(<PortalCTA />);
    expect(phase()).toBe('idle');
    expect(portal().getAttribute('aria-busy')).toBeNull();
  });

  it('wakes into inviting on pointer enter and focus, resting again on leave', () => {
    render(<PortalCTA />);

    fireEvent.pointerEnter(portal());
    expect(phase()).toBe('inviting');

    fireEvent.pointerLeave(portal());
    expect(phase()).toBe('idle');

    fireEvent.focus(portal());
    expect(phase()).toBe('inviting');

    fireEvent.blur(portal());
    expect(phase()).toBe('idle');
  });

  it('never wakes while disabled', () => {
    render(<PortalCTA disabled />);
    fireEvent.pointerEnter(portal());
    fireEvent.focus(portal());
    expect(phase()).toBe('idle');
    expect(portal().getAttribute('aria-disabled')).toBe('true');
  });

  it('runs accepting → crossing → settling → idle on activation', async () => {
    const onAccept = vi.fn();
    const onComplete = vi.fn();
    render(<PortalCTA onAccept={onAccept} onComplete={onComplete} />);

    fireEvent.click(portal());
    expect(phase()).toBe('accepting');
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(portal().getAttribute('aria-busy')).toBe('true');
    expect(onComplete).not.toHaveBeenCalled();

    await advance(PORTAL_SEQUENCE.accepting);
    expect(phase()).toBe('crossing');

    await advance(PORTAL_SEQUENCE.crossing);
    expect(phase()).toBe('settling');
    expect(onComplete).not.toHaveBeenCalled();

    await advance(PORTAL_SEQUENCE.settling);
    expect(phase()).toBe('idle');
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(portal().getAttribute('aria-busy')).toBeNull();
  });

  it('locks the invitation for the whole ceremony so activations cannot stack', async () => {
    const onAccept = vi.fn();
    render(<PortalCTA onAccept={onAccept} />);

    fireEvent.click(portal());
    fireEvent.click(portal());
    await advance(PORTAL_SEQUENCE.accepting);
    fireEvent.click(portal());

    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(phase()).toBe('crossing');
  });

  it('ignores hover and focus changes while locked', async () => {
    render(<PortalCTA />);

    fireEvent.click(portal());
    fireEvent.pointerLeave(portal());
    expect(phase()).toBe('accepting');

    fireEvent.pointerEnter(portal());
    expect(phase()).toBe('accepting');

    await advance(
      PORTAL_SEQUENCE.accepting +
        PORTAL_SEQUENCE.crossing +
        PORTAL_SEQUENCE.settling,
    );
    expect(phase()).toBe('idle');
  });

  it('never begins the ceremony while disabled', async () => {
    const onAccept = vi.fn();
    const onComplete = vi.fn();
    render(<PortalCTA disabled onAccept={onAccept} onComplete={onComplete} />);

    fireEvent.click(portal());
    await advance(10);

    expect(phase()).toBe('idle');
    expect(onAccept).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('swallows Enter and Space while locked but still forwards the event', async () => {
    const onKeyDown = vi.fn();
    render(<PortalCTA onKeyDown={onKeyDown} />);

    const unlocked = fireEvent.keyDown(portal(), { key: 'Enter' });
    expect(unlocked).toBe(true);

    fireEvent.click(portal());
    const locked = fireEvent.keyDown(portal(), { key: 'Enter' });
    expect(locked).toBe(false);
    expect(fireEvent.keyDown(portal(), { key: ' ' })).toBe(false);
    expect(fireEvent.keyDown(portal(), { key: 'Tab' })).toBe(true);
    expect(onKeyDown).toHaveBeenCalledTimes(4);

    await advance(
      PORTAL_SEQUENCE.accepting +
        PORTAL_SEQUENCE.crossing +
        PORTAL_SEQUENCE.settling,
    );
  });

  it('hides the decorative geometry from assistive technology', () => {
    render(<PortalCTA />);
    const decoration = portal().querySelector('[aria-hidden="true"]');
    expect(decoration).not.toBeNull();
  });

  it('can be activated again once the ceremony completes', async () => {
    const onAccept = vi.fn();
    render(<PortalCTA onAccept={onAccept} />);

    fireEvent.click(portal());
    await advance(
      PORTAL_SEQUENCE.accepting +
        PORTAL_SEQUENCE.crossing +
        PORTAL_SEQUENCE.settling,
    );
    fireEvent.click(portal());

    expect(onAccept).toHaveBeenCalledTimes(2);
    expect(phase()).toBe('accepting');

    await advance(
      PORTAL_SEQUENCE.accepting +
        PORTAL_SEQUENCE.crossing +
        PORTAL_SEQUENCE.settling,
    );
  });
});

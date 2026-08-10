// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ARRIVAL_PHASE_ORDER } from '../arrival-scene/arrival-scene.motion';
import { Hero } from './hero';

afterEach(cleanup);

describe('Hero', () => {
  it('renders brand identity as the page heading', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'AetherAnime',
    );
    expect(screen.getByText('Enter the World Beyond the Screen')).toBeDefined();
  });

  it('rests in idle when no phase is given', () => {
    render(<Hero />);
    expect(
      document.querySelector('[data-slot="hero"]')?.getAttribute('data-phase'),
    ).toBe('idle');
  });

  it('exposes the director phase on the performer element', () => {
    for (const phase of ARRIVAL_PHASE_ORDER) {
      cleanup();
      render(<Hero phase={phase} />);
      const performer = document.querySelector('[data-slot="hero"]');
      expect(performer?.getAttribute('data-phase')).toBe(phase);
    }
  });
});

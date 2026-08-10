// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ExperienceLayout } from './experience-layout';

afterEach(cleanup);

describe('ExperienceLayout', () => {
  it('renders scene content inside a main landmark', () => {
    render(
      <ExperienceLayout>
        <p>scene</p>
      </ExperienceLayout>,
    );
    const main = screen.getByRole('main');
    expect(main.textContent).toBe('scene');
  });

  it('fills the viewport with the semantic theme surface', () => {
    render(
      <ExperienceLayout>
        <p>scene</p>
      </ExperienceLayout>,
    );
    const shell = screen.getByRole('main').parentElement as HTMLElement;
    for (const token of [
      'min-h-screen',
      'overflow-hidden',
      'bg-background',
      'text-foreground',
    ]) {
      expect(shell.className).toContain(token);
    }
  });

  it('centres the scene without owning choreography', () => {
    render(
      <ExperienceLayout>
        <p>scene</p>
      </ExperienceLayout>,
    );
    const main = screen.getByRole('main');
    expect(main.className).toContain('items-center');
    expect(main.className).toContain('justify-center');
    expect(main.className).not.toContain('animate');
  });
});

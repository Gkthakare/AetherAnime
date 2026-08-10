// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { elevation, glass } from '@/shared/lib/graphics';

import { Surface } from './surface';

afterEach(cleanup);

function surfaceOf(): HTMLElement {
  return screen.getByTestId('surface');
}

describe('Surface', () => {
  it('renders its children inside a slotted div', () => {
    render(
      <Surface data-testid="surface">
        <span>beyond the screen</span>
      </Surface>,
    );
    expect(surfaceOf().dataset.slot).toBe('surface');
    expect(surfaceOf().textContent).toBe('beyond the screen');
  });

  it('adds no chrome by default', () => {
    render(<Surface data-testid="surface">content</Surface>);
    expect(surfaceOf().className).toBe('');
  });

  it('applies the variant presentation classes', () => {
    render(
      <Surface data-testid="surface" variant="floating">
        content
      </Surface>,
    );
    const classes = surfaceOf().className;
    for (const token of `${glass.floating} ${elevation.floating}`.split(' ')) {
      expect(classes).toContain(token);
    }
  });

  it('merges a layout className without dropping the variant', () => {
    render(
      <Surface data-testid="surface" variant="glass" className="flex w-full">
        content
      </Surface>,
    );
    const classes = surfaceOf().className;
    expect(classes).toContain('flex');
    expect(classes).toContain('w-full');
    expect(classes).toContain(glass.primary.split(' ')[0]);
  });

  it('forwards arbitrary div attributes', () => {
    render(
      <Surface data-testid="surface" id="portal-panel" aria-label="panel">
        content
      </Surface>,
    );
    expect(surfaceOf().id).toBe('portal-panel');
    expect(surfaceOf().getAttribute('aria-label')).toBe('panel');
  });
});

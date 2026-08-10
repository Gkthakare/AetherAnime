import { describe, expect, it } from 'vitest';

import { cn } from './utils';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('drops falsy values and flattens arrays and objects', () => {
    expect(
      cn('a', false, undefined, null, ['b', 'c'], { d: true, e: false }),
    ).toBe('a b c d');
  });

  it('lets the last conflicting tailwind utility win', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('keeps non-conflicting utilities from different groups', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4');
  });

  it('returns an empty string for no meaningful input', () => {
    expect(cn()).toBe('');
    expect(cn(false, undefined)).toBe('');
  });
});

import { describe, expect, it } from 'vitest';

import { toWorldSlug, worldHref } from './world-transition';

describe('toWorldSlug', () => {
  it('lowercases and hyphenates a destination name', () => {
    expect(toWorldSlug('AetherAnime')).toBe('aetheranime');
    expect(toWorldSlug('Hidden Leaf Village')).toBe('hidden-leaf-village');
  });

  it('collapses runs of non-alphanumeric characters into one hyphen', () => {
    expect(toWorldSlug('Shibuya   ///  Ward')).toBe('shibuya-ward');
    expect(toWorldSlug('Neo_Tokyo 3')).toBe('neo-tokyo-3');
  });

  it('trims surrounding whitespace and edge hyphens', () => {
    expect(toWorldSlug('  Grand Line  ')).toBe('grand-line');
    expect(toWorldSlug('---Wano---')).toBe('wano');
  });

  it('returns an empty slug when nothing survives normalization', () => {
    expect(toWorldSlug('')).toBe('');
    expect(toWorldSlug('   ')).toBe('');
    expect(toWorldSlug('!!! ???')).toBe('');
  });

  it('drops non-ascii characters rather than transliterating them', () => {
    expect(toWorldSlug('東京 Tower')).toBe('tower');
  });
});

describe('worldHref', () => {
  it('builds an app router href from the slug', () => {
    expect(worldHref('AetherAnime')).toBe('/world/aetheranime');
    expect(worldHref('Hidden Leaf Village')).toBe('/world/hidden-leaf-village');
  });

  it('falls back to the default world when the slug is empty', () => {
    expect(worldHref('')).toBe('/world/aetheranime');
    expect(worldHref('***')).toBe('/world/aetheranime');
  });

  it('never emits a trailing or doubled separator', () => {
    for (const destination of ['Wano ', ' -Dressrosa-', 'A  B']) {
      const href = worldHref(destination);
      expect(href.startsWith('/world/')).toBe(true);
      expect(href).not.toMatch(/\/\//);
      expect(href.endsWith('/')).toBe(false);
    }
  });
});

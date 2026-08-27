import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { resolveAnime } from './anime.resolver';

describe('resolveAnime', () => {
  test('resolves Solo Leveling by exact canonical title', () => {
    const result = resolveAnime('Solo Leveling');
    assert.equal(result.status, 'resolved');
    if (result.status === 'resolved') {
      assert.equal(result.anime.slug, 'solo-leveling');
    }
  });

  test('resolves solo leveling after normalization', () => {
    const result = resolveAnime('solo leveling');
    assert.equal(result.status, 'resolved');
    if (result.status === 'resolved') {
      assert.equal(result.anime.canonicalTitle, 'Solo Leveling');
    }
  });

  test('resolves solo-leveling by slug', () => {
    const result = resolveAnime('solo-leveling');
    assert.equal(result.status, 'resolved');
    if (result.status === 'resolved') {
      assert.equal(result.anime.slug, 'solo-leveling');
    }
  });

  test('treats Fate as ambiguous across Fate titles', () => {
    const result = resolveAnime('Fate');
    assert.equal(result.status, 'ambiguous');
    if (result.status === 'ambiguous') {
      assert.ok(result.candidates.length >= 2);
      const slugs = result.candidates.map((anime) => anime.slug);
      assert.ok(slugs.includes('fate-stay-night'));
      assert.ok(slugs.includes('fate-zero'));
      assert.ok(slugs.includes('fate-grand-order'));
    }
  });

  test('resolves Fate/Zero by exact canonical title', () => {
    const result = resolveAnime('Fate/Zero');
    assert.equal(result.status, 'resolved');
    if (result.status === 'resolved') {
      assert.equal(result.anime.slug, 'fate-zero');
    }
  });

  test('returns unknown for a nonexistent title', () => {
    const result = resolveAnime('something completely nonexistent');
    assert.equal(result.status, 'unknown');
  });

  test('does not silently pick a Fate title from a partial prefix when several match', () => {
    const result = resolveAnime('Fate/');
    assert.notEqual(result.status, 'resolved');
  });
});

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { resolveAnime } from './anime.resolver';
import { normalizeVoiceQuery } from './anime.voice';

describe('normalizeVoiceQuery', () => {
  test('strips Take me to and preserves the title', () => {
    assert.equal(normalizeVoiceQuery('Take me to Solo Leveling'), 'Solo Leveling');
  });

  test('strips bring me to without changing remainder case', () => {
    assert.equal(normalizeVoiceQuery('bring me to Fate Zero'), 'Fate Zero');
  });

  test('strips show me and leaves an ambiguous stem intact', () => {
    assert.equal(normalizeVoiceQuery('show me Fate'), 'Fate');
  });

  test('preserves a plain title with no command prefix', () => {
    assert.equal(normalizeVoiceQuery('Solo Leveling'), 'Solo Leveling');
  });

  test('preserves an unknown destination after a command prefix', () => {
    assert.equal(
      normalizeVoiceQuery('Take me to Completely Unknown Anime'),
      'Completely Unknown Anime',
    );
  });

  test('strips trailing punctuation from a command', () => {
    assert.equal(
      normalizeVoiceQuery('Take me to Solo Leveling!'),
      'Solo Leveling',
    );
  });

  test('strips take me into, I want to watch, I want to enter, and Open prefixes', () => {
    assert.equal(
      normalizeVoiceQuery('Take me into Fate Zero'),
      'Fate Zero',
    );
    assert.equal(
      normalizeVoiceQuery('I want to watch Solo Leveling'),
      'Solo Leveling',
    );
    assert.equal(
      normalizeVoiceQuery('I want to enter Frieren'),
      'Frieren',
    );
    assert.equal(normalizeVoiceQuery('Give me something like Fate Zero'), 'something like Fate Zero');
    assert.equal(normalizeVoiceQuery('Open Solo Leveling'), 'Solo Leveling');
  });
});

describe('voice query converges on resolveAnime', () => {
  test('Take me to Solo Leveling resolves through the existing catalog', () => {
    const result = resolveAnime(
      normalizeVoiceQuery('Take me to Solo Leveling'),
    );
    assert.equal(result.status, 'resolved');
    if (result.status === 'resolved') {
      assert.equal(result.anime.slug, 'solo-leveling');
    }
  });

  test('Take me to Fate remains ambiguous', () => {
    const result = resolveAnime(normalizeVoiceQuery('Take me to Fate'));
    assert.equal(result.status, 'ambiguous');
    if (result.status === 'ambiguous') {
      assert.ok(result.candidates.length >= 2);
    }
  });

  test('Take me to Completely Unknown Anime stays unknown', () => {
    const result = resolveAnime(
      normalizeVoiceQuery('Take me to Completely Unknown Anime'),
    );
    assert.equal(result.status, 'unknown');
  });

  test('case does not destroy resolver matching', () => {
    const result = resolveAnime(
      normalizeVoiceQuery('TAKE ME TO solo leveling'),
    );
    assert.equal(result.status, 'resolved');
    if (result.status === 'resolved') {
      assert.equal(result.anime.slug, 'solo-leveling');
    }
  });
});

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { ANIME_TYPE_LABEL } from './anime.labels';
import { ANIME_TYPES } from './anime.types';

describe('ANIME_TYPE_LABEL', () => {
  test('labels every AnimeType with the existing display strings', () => {
    assert.deepEqual(
      [...ANIME_TYPES],
      ['tv', 'movie', 'ova', 'ona', 'special'],
    );
    assert.equal(ANIME_TYPE_LABEL.tv, 'TV');
    assert.equal(ANIME_TYPE_LABEL.movie, 'Movie');
    assert.equal(ANIME_TYPE_LABEL.ova, 'OVA');
    assert.equal(ANIME_TYPE_LABEL.ona, 'ONA');
    assert.equal(ANIME_TYPE_LABEL.special, 'Special');
    assert.deepEqual(Object.keys(ANIME_TYPE_LABEL).sort(), [...ANIME_TYPES].sort());
  });
});

/**
 * TASK-074 — validated CanonicalAnime.poster sources.
 *
 * Local catalog paths and trusted MAL CDN URLs only.
 * Never invent artwork. Never accept arbitrary remotes.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  malMainPicturePoster,
  validateAnimePosterSource,
} from './anime.poster';
import {
  canonicalizeDiscoveryCandidate,
  normalizeMalDiscoveryNode,
  normalizeMalDiscoveryPayload,
} from './anime.discovery';

const dir = dirname(fileURLToPath(import.meta.url));
const malDiscoverySource = readFileSync(
  join(dir, 'anime.mal.discovery.ts'),
  'utf8',
);
const nextConfigSource = readFileSync(
  join(dir, '../../next.config.ts'),
  'utf8',
);
const typesSource = readFileSync(join(dir, 'anime.types.ts'), 'utf8');

const TRUSTED_LARGE =
  'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg';
const TRUSTED_MEDIUM =
  'https://cdn.myanimelist.net/images/anime/1171/109222.jpg';

describe('validateAnimePosterSource', () => {
  test('accepts catalog local poster paths', () => {
    assert.equal(
      validateAnimePosterSource(
        '/assets/aetheranime/anime/solo-leveling/solo-leveling-poster.webp',
      ),
      '/assets/aetheranime/anime/solo-leveling/solo-leveling-poster.webp',
    );
  });

  test('accepts https cdn.myanimelist.net /images/anime/ URLs', () => {
    assert.equal(validateAnimePosterSource(TRUSTED_LARGE), TRUSTED_LARGE);
  });

  test('rejects http, wrong host, and non-anime paths', () => {
    assert.equal(
      validateAnimePosterSource(
        'http://cdn.myanimelist.net/images/anime/1171/109222.jpg',
      ),
      null,
    );
    assert.equal(
      validateAnimePosterSource(
        'https://myanimelist.net/anime/40748/Jujutsu_Kaisen',
      ),
      null,
    );
    assert.equal(
      validateAnimePosterSource(
        'https://cdn.myanimelist.net/images/manga/1/1.jpg',
      ),
      null,
    );
    assert.equal(
      validateAnimePosterSource(
        'https://evil.example/images/anime/1171/109222.jpg',
      ),
      null,
    );
    assert.equal(validateAnimePosterSource(''), null);
    assert.equal(validateAnimePosterSource(null), null);
  });
});

describe('malMainPicturePoster', () => {
  test('prefers large then medium', () => {
    assert.equal(
      malMainPicturePoster({ large: TRUSTED_LARGE, medium: TRUSTED_MEDIUM }),
      TRUSTED_LARGE,
    );
    assert.equal(
      malMainPicturePoster({ medium: TRUSTED_MEDIUM }),
      TRUSTED_MEDIUM,
    );
  });

  test('rejects untrusted picture URLs', () => {
    assert.equal(
      malMainPicturePoster({
        large: 'https://evil.example/images/anime/1.jpg',
        medium: TRUSTED_MEDIUM,
      }),
      TRUSTED_MEDIUM,
    );
    assert.equal(
      malMainPicturePoster({
        large: 'https://evil.example/a.jpg',
        medium: 'https://evil.example/b.jpg',
      }),
      null,
    );
    assert.equal(malMainPicturePoster(null), null);
  });
});

describe('discovery normalization carries validated poster only', () => {
  test('maps main_picture into candidate.poster without raw main_picture', () => {
    const candidate = normalizeMalDiscoveryNode({
      id: 40748,
      title: 'Jujutsu Kaisen',
      main_picture: { large: TRUSTED_LARGE, medium: TRUSTED_MEDIUM },
      media_type: 'tv',
      status: 'finished_airing',
      start_date: '2020-10-03',
      num_episodes: 24,
      genres: [{ id: 1, name: 'Action' }],
      studios: [{ id: 1, name: 'MAPPA' }],
    });
    assert.ok(candidate);
    assert.equal(candidate.poster, TRUSTED_LARGE);
    assert.equal('main_picture' in candidate, false);
  });

  test('payload normalize keeps validated posters', () => {
    const candidates = normalizeMalDiscoveryPayload({
      data: [
        {
          node: {
            id: 40748,
            title: 'Jujutsu Kaisen',
            main_picture: { medium: TRUSTED_MEDIUM },
            media_type: 'tv',
            status: 'finished_airing',
          },
        },
      ],
    });
    assert.equal(candidates[0]?.poster, TRUSTED_MEDIUM);
    assert.equal('main_picture' in (candidates[0] ?? {}), false);
  });
});

describe('canonicalizeDiscoveryCandidate poster contract', () => {
  test('discovered anime receives validated candidate poster', () => {
    const anime = canonicalizeDiscoveryCandidate({
      malId: 40748,
      title: 'Jujutsu Kaisen',
      alternateTitle: null,
      year: 2020,
      type: 'tv',
      episodeCount: 24,
      status: 'finished',
      genres: ['Action'],
      studios: ['MAPPA'],
      poster: TRUSTED_LARGE,
    });
    assert.equal(anime.slug, 'discovered-40748');
    assert.equal(anime.poster, TRUSTED_LARGE);
  });

  test('untrusted candidate poster becomes null', () => {
    const anime = canonicalizeDiscoveryCandidate({
      malId: 40748,
      title: 'Jujutsu Kaisen',
      alternateTitle: null,
      year: 2020,
      type: 'tv',
      episodeCount: 24,
      status: 'finished',
      genres: ['Action'],
      studios: ['MAPPA'],
      poster: 'https://evil.example/x.jpg',
    });
    assert.equal(anime.poster, null);
  });

  test('catalog MAL IDs keep local catalog poster', () => {
    const anime = canonicalizeDiscoveryCandidate({
      malId: 52299,
      title: 'Ore dake Level Up na Ken',
      alternateTitle: 'Solo Leveling',
      year: 2024,
      type: 'tv',
      episodeCount: 12,
      status: 'finished',
      genres: ['Action'],
      studios: ['A-1 Pictures'],
      poster: TRUSTED_LARGE,
    });
    assert.equal(anime.slug, 'solo-leveling');
    assert.match(anime.poster ?? '', /^\/assets\/aetheranime\/anime\//);
  });
});

describe('TASK-074 adapter and Next image contracts', () => {
  test('discovery field list requests main_picture', () => {
    assert.match(malDiscoverySource, /main_picture/);
  });

  test('next.config allows only MAL anime CDN remotePatterns', () => {
    assert.match(nextConfigSource, /remotePatterns/);
    assert.match(nextConfigSource, /cdn\.myanimelist\.net/);
    assert.match(nextConfigSource, /\/images\/anime\/\*\*/);
    assert.doesNotMatch(nextConfigSource, /hostname:\s*['"]\*['"]/);
  });

  test('CanonicalAnime.poster docs describe validated local or MAL CDN', () => {
    assert.match(typesSource, /Validated presentation artwork/);
    assert.doesNotMatch(typesSource, /artworkUrl|artworkKey/);
  });
});

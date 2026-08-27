/**
 * TASK-075 — Destination Option D: anime artwork as recognizable environment.
 *
 * poster channel only. No second artwork field. Null → no field (TASK-060).
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { BLUR_RADIUS } from '@/shared/lib/graphics';
import { ANIME_CATALOG } from '@/shared/anime/anime.catalog';
import { canonicalizeDiscoveryCandidate } from '@/shared/anime/anime.discovery';

import { animeArrivalAtmosphere } from './anime-arrival-atmosphere';
import {
  ARRIVAL_ATMOSPHERE_OPACITY,
  ARRIVAL_ATMOSPHERE_PROJECTION,
} from './anime-arrival-atmosphere.motion';

const dir = dirname(fileURLToPath(import.meta.url));
function bySlug(slug: string) {
  const anime = ANIME_CATALOG.find((entry) => entry.slug === slug);
  assert.ok(anime);
  return anime;
}
const cssSource = readFileSync(
  join(dir, 'anime-arrival-atmosphere.css'),
  'utf8',
);
const viewSource = readFileSync(
  join(dir, 'anime-arrival-atmosphere.view.tsx'),
  'utf8',
);
const motionSource = readFileSync(
  join(dir, 'anime-arrival-atmosphere.motion.ts'),
  'utf8',
);
const environmentSource = readFileSync(
  join(dir, '../world-environment/world-environment.tsx'),
  'utf8',
);
const presenceCss = readFileSync(
  join(dir, '../world-environment/world-destination-presence.css'),
  'utf8',
);
const geographyCss = readFileSync(
  join(dir, '../world-environment/world-idle-geography.css'),
  'utf8',
);
const typesSource = readFileSync(
  join(dir, '../../shared/anime/anime.types.ts'),
  'utf8',
);

const MAL_POSTER =
  'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg';

describe('TASK-075 Option D anime environmental field', () => {
  test('field activates from CanonicalAnime.poster only — catalog and MAL', () => {
    const solo = bySlug('solo-leveling');
    const zero = bySlug('fate-zero');
    assert.equal(
      animeArrivalAtmosphere({ poster: solo.poster, reduceMotion: false })
        .source,
      solo.poster,
    );
    assert.equal(
      animeArrivalAtmosphere({ poster: zero.poster, reduceMotion: false })
        .source,
      zero.poster,
    );
    assert.notEqual(solo.poster, zero.poster);
    assert.equal(
      animeArrivalAtmosphere({ poster: MAL_POSTER, reduceMotion: false })
        .source,
      MAL_POSTER,
    );
    assert.doesNotMatch(typesSource, /artworkUrl|artworkKey|backgroundPoster/);
    assert.match(viewSource, /src=\{presentation\.source\}/);
  });

  test('null poster does not mount the environmental field', () => {
    assert.equal(
      animeArrivalAtmosphere({ poster: null, reduceMotion: false }).active,
      false,
    );
    const discovered = canonicalizeDiscoveryCandidate({
      malId: 40748,
      title: 'Jujutsu Kaisen',
      alternateTitle: null,
      year: 2020,
      type: 'tv',
      episodeCount: 24,
      status: 'finished',
      genres: ['Action'],
      studios: [],
      poster: null,
    });
    assert.equal(discovered.poster, null);
    assert.equal(
      animeArrivalAtmosphere({
        poster: discovered.poster,
        reduceMotion: false,
      }).active,
      false,
    );
  });

  test('artwork remains recognizable — soft blur, high settle, no screen wash', () => {
    assert.match(viewSource, /BLUR_RADIUS\.lg/);
    assert.equal(BLUR_RADIUS.lg, '24px');
    assert.ok(
      Number.parseFloat(BLUR_RADIUS.lg) <
        Number.parseFloat(BLUR_RADIUS.atmospheric),
    );
    assert.match(cssSource, /--arrival-atmosphere-settle:\s*0\.(7|8|9)/);
    assert.doesNotMatch(cssSource, /mix-blend-mode:\s*screen/);
    assert.match(cssSource, /mask-image:\s*radial-gradient/);
    assert.match(ARRIVAL_ATMOSPHERE_PROJECTION, /inset-\[-/);
    assert.ok(ARRIVAL_ATMOSPHERE_OPACITY.settle >= 0.7);
  });

  test('WorldEnvironment exposes artwork presence for subordinate Destination geography', () => {
    assert.match(
      environmentSource,
      /data-anime-artwork=\{poster \? 'present' : 'absent'\}/,
    );
    assert.match(presenceCss, /data-anime-artwork='present'/);
    assert.match(
      presenceCss,
      /data-anime-artwork='present'[\s\S]*world-environment-image[\s\S]*opacity:\s*0\.[12]/,
    );
    assert.match(presenceCss, /TASK-075/);
  });

  test('Idle geography CSS is untouched by Option D', () => {
    assert.match(geographyCss, /TASK-058-E/);
    assert.doesNotMatch(geographyCss, /TASK-075|data-anime-artwork/);
  });

  test('decorative a11y and static settle preserved', () => {
    assert.match(viewSource, /aria-hidden="true"/);
    assert.match(viewSource, /pointer-events-none/);
    assert.match(viewSource, /alt=""/);
    assert.doesNotMatch(presenceCss, /@keyframes|animation\s*:|will-change\s*:/);
    assert.match(cssSource, /prefers-reduced-motion:\s*reduce/);
    assert.match(motionSource, /ARRIVAL_ATMOSPHERE/);
  });

  test('single atmosphere Image — no second artwork field or compositor', () => {
    const imageCount = (viewSource.match(/<Image\b/g) ?? []).length;
    assert.equal(imageCount, 1);
    assert.doesNotMatch(viewSource, /canvas|WebGL|createContext/);
    assert.doesNotMatch(environmentSource, /artworkUrl|backgroundPoster/);
  });
});

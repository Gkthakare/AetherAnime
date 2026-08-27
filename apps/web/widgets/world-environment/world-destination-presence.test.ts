import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  WORLD_ENVIRONMENT_ARRIVAL_IDENTITY_OPACITY,
  WORLD_ENVIRONMENT_ARRIVAL_LIGHT_OPACITY,
} from './world-environment.constants';
import { worldArrivalAtmosphere } from './world-arrival.atmosphere';

const dir = dirname(fileURLToPath(import.meta.url));
const destinationPresencePath = join(dir, 'world-destination-presence.css');
const environmentSource = readFileSync(join(dir, 'world-environment.tsx'), 'utf8');
const geographyCss = readFileSync(join(dir, 'world-idle-geography.css'), 'utf8');
const landmarkCss = readFileSync(
  join(dir, '../world-kind/world-kind.landmarks.css'),
  'utf8',
);
const memoryCss = readFileSync(
  join(dir, '../world-memory-horizon/world-memory-horizon.css'),
  'utf8',
);
const realmCrossing = readFileSync(
  join(dir, 'world-realm-crossing.view.tsx'),
  'utf8',
);
const arrivalAtmosphereCss = readFileSync(
  join(dir, '../anime-arrival-atmosphere/anime-arrival-atmosphere.css'),
  'utf8',
);
const animeTypes = readFileSync(
  join(dir, '../../shared/anime/anime.types.ts'),
  'utf8',
);

describe('TASK-060 destination environmental presence', () => {
  test('Destination presence is a dedicated stylesheet gated on data-world-anime', () => {
    assert.equal(existsSync(destinationPresencePath), true);
    assert.match(environmentSource, /world-destination-presence\.css/);
    const css = readFileSync(destinationPresencePath, 'utf8');
    assert.match(css, /TASK-060/);
    assert.match(css, /\[data-slot='world-scene'\]\[data-world-anime\]/);
    assert.doesNotMatch(css, /:not\(\[data-world-anime\]\)/);
  });

  test('presence is static — no new continuous animation or compositor system', () => {
    const css = readFileSync(destinationPresencePath, 'utf8');
    assert.doesNotMatch(css, /@keyframes/);
    assert.doesNotMatch(css, /animation\s*:/);
    assert.doesNotMatch(css, /will-change\s*:/);
    assert.doesNotMatch(css, /WebGL|canvas|particle/i);
    assert.doesNotMatch(environmentSource, /from 'three'|gsap|lenis/);
  });

  test('Idle geography, Memory, and TASK-059 crossings stay untouched owners', () => {
    assert.match(geographyCss, /TASK-058-E/);
    assert.doesNotMatch(geographyCss, /destination-presence|TASK-060/);
    assert.match(memoryCss, /data-world-anime/);
    assert.doesNotMatch(landmarkCss, /destination-presence|data-world-anime/);
    assert.match(realmCrossing, /WorldRealmCrossing|world-realm-crossing/);
    assert.doesNotMatch(realmCrossing, /destination-presence/);
  });

  test('genre arrival atmosphere mapping remains the data contract', () => {
    const arrival = worldArrivalAtmosphere({
      arrivedAnime: {
        id: 'anime.solo-leveling',
        canonicalTitle: 'Solo Leveling',
        alternateTitles: [],
        slug: 'solo-leveling',
        synopsis: '',
        year: 2024,
        type: 'tv',
        episodeCount: 12,
        status: 'finished',
        genres: ['Action', 'Fantasy'],
        studios: [],
        poster: '/assets/x.webp',
        officialUrl: null,
        ratings: { mal: null, crunchyroll: null },
      },
      regionClimate: null,
    });
    assert.equal(arrival.source, 'arrival');
    assert.equal(arrival.climate, 'charged');
    assert.equal(arrival.destinationOpacity, WORLD_ENVIRONMENT_ARRIVAL_LIGHT_OPACITY);
    assert.equal(arrival.identityOpacity, WORLD_ENVIRONMENT_ARRIVAL_IDENTITY_OPACITY);
    assert.ok(WORLD_ENVIRONMENT_ARRIVAL_LIGHT_OPACITY > 0.16);
    assert.ok(WORLD_ENVIRONMENT_ARRIVAL_IDENTITY_OPACITY > 0.05);
  });

  test('poster-null arrival still gets arrival atmosphere without requiring poster wash', () => {
    const arrival = worldArrivalAtmosphere({
      arrivedAnime: {
        id: 'anime.discovered.1',
        canonicalTitle: 'Unknown',
        alternateTitles: [],
        slug: 'discovered-1',
        synopsis: '',
        year: null,
        type: 'tv',
        episodeCount: null,
        status: 'finished',
        genres: ['Drama'],
        studios: [],
        poster: null,
        officialUrl: null,
        ratings: { mal: null, crunchyroll: null },
      },
      regionClimate: null,
    });
    assert.equal(arrival.source, 'arrival');
    assert.equal(arrival.climate, 'warm');
    assert.ok(arrival.destinationOpacity > 0);
    assert.match(environmentSource, /AnimeArrivalAtmosphere/);
  });

  test('no CanonicalAnime climate schema expansion', () => {
    assert.match(animeTypes, /export type CanonicalAnime/);
    assert.doesNotMatch(
      animeTypes,
      /export type CanonicalAnime = \{[\s\S]*?\bclimate\b/,
    );
    assert.doesNotMatch(
      animeTypes,
      /export type CanonicalAnime = \{[\s\S]*?\batmosphere\b/,
    );
  });

  test('WorldEnvironment remains decorative and still hosts poster wash', () => {
    assert.match(environmentSource, /aria-hidden="true"/);
    assert.match(environmentSource, /pointer-events-none/);
    assert.match(environmentSource, /AnimeArrivalAtmosphere/);
    assert.match(arrivalAtmosphereCss, /aether-arrival-atmosphere/);
  });

  test('Destination presence recomposes near/middle without restoring Idle far', () => {
    const css = readFileSync(destinationPresencePath, 'utf8');
    assert.match(
      css,
      /world-environment-foreground|aether-living-haze|world-environment-image|world-environment-depth|destination-atmosphere/,
    );
    assert.doesNotMatch(css, /world-environment-far[^\n]*opacity:\s*1/);
    assert.doesNotMatch(css, /midground-continuation[^\n]*opacity:\s*[1-9]/);
  });
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const widgetDir = dirname(fileURLToPath(import.meta.url));
const sceneDir = join(widgetDir, '../world-scene');

const destinationSource = readFileSync(
  join(widgetDir, 'anime-destination.tsx'),
  'utf8',
);
const networkSource = readFileSync(
  join(widgetDir, 'anime-destination-network.tsx'),
  'utf8',
);
const universeCss = readFileSync(
  join(widgetDir, 'anime-destination.universe.css'),
  'utf8',
);
const constantsSource = readFileSync(
  join(widgetDir, 'anime-destination.constants.ts'),
  'utf8',
);
const sceneSource = readFileSync(join(sceneDir, 'world-scene.tsx'), 'utf8');
const typesSource = readFileSync(join(sceneDir, 'world-scene.types.ts'), 'utf8');
const memorySource = readFileSync(
  join(widgetDir, '../../shared/anime/anime.memory.ts'),
  'utf8',
);

describe('TASK-100 universe continuity', () => {
  test('WorldScene keeps an ephemeral journey origin across in-scene arriveAnime hops', () => {
    assert.match(typesSource, /journeyOrigin/);
    assert.match(sceneSource, /setJourneyOrigin|journeyOrigin/);
    assert.match(sceneSource, /beginAnimeTransport/);
    // Capture previous before depart clears arrivedAnime.
    assert.match(sceneSource, /journeyOrigin|previous/);
    assert.doesNotMatch(sceneSource, /sessionStorage|aetheranime\.journey/);
    assert.doesNotMatch(typesSource, /universeGraph|worldPosition|travellerCoordinate/);
  });

  test('journey origin clears when returning to Continuum and is not Memory persistence', () => {
    assert.match(sceneSource, /setJourneyOrigin\(null\)/);
    assert.match(sceneSource, /clearAnimeArrival/);
    assert.doesNotMatch(memorySource, /journeyOrigin|previousWorld|fromSlug/);
    assert.match(memorySource, /Records places, not visits/);
  });

  test('Beyond surfaces a residual spatial origin, not a breadcrumb or previous-card', () => {
    assert.match(networkSource, /data-slot="anime-universe-journey-trace"/);
    assert.match(destinationSource, /journeyOrigin/);
    assert.match(constantsSource, /journeyFrom/);
    assert.doesNotMatch(
      networkSource + destinationSource,
      /breadcrumb|You came from|Previous anime|Back to previous|history list/i,
    );
    assert.doesNotMatch(networkSource, /rounded-md|shadow-lg|bg-card|carousel/);
  });

  test('residual origin travels through arriveAnime when selected', () => {
    assert.match(networkSource, /onReturn/);
    assert.match(destinationSource, /arriveAnime\(journeyOrigin\)/);
    assert.doesNotMatch(destinationSource, /router\.push|window\.location/);
  });

  test('continuity remains CSS/DOM and does not add a graph engine or second transport', () => {
    assert.match(universeCss, /anime-universe-journey-trace/);
    assert.match(destinationSource, /data-universe-journey/);
    assert.doesNotMatch(destinationSource, /WebGL|R3F|<canvas/i);
    assert.doesNotMatch(typesSource, /universeGraph|worldPosition|travellerCoordinate/);
    assert.match(destinationSource, /markArrivalVia\('kinship'\)/);
  });
});

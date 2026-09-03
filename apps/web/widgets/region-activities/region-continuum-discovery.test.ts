import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const discoverySource = readFileSync(
  join(dir, 'region-continuum-discovery.tsx'),
  'utf8',
);
const activitiesSource = readFileSync(
  join(dir, 'region-activities.tsx'),
  'utf8',
);

describe('region continuum discovery contracts', () => {
  test('Continuum exposes a discovery activity surface', () => {
    assert.match(discoverySource, /data-slot="region-continuum-discovery"/);
    assert.match(discoverySource, /resolveContinuumDiscoveryCandidates/);
    assert.match(activitiesSource, /RegionContinuumDiscovery/);
    assert.match(activitiesSource, /isContinuumDiscoveryRegion/);
  });

  test('selection delegates to WorldScene arriveAnime, not router', () => {
    assert.match(discoverySource, /arriveAnime\(/);
    assert.doesNotMatch(discoverySource, /useRouter/);
    assert.doesNotMatch(discoverySource, /router\.push/);
  });

  test('transport lock blocks duplicate selection', () => {
    assert.match(discoverySource, /isTransportLocked/);
    assert.match(discoverySource, /disabled=\{isTransportLocked\}/);
  });

  test('discovery uses existing path presentation, not a card grid', () => {
    assert.match(discoverySource, /WORLD_NAVIGATOR_PATH/);
    assert.doesNotMatch(discoverySource, /grid-cols/);
    assert.doesNotMatch(discoverySource, /carousel|swiper/i);
  });

  test('keyboard reachable with focus-visible ring', () => {
    assert.match(discoverySource, /type="button"/);
    assert.match(discoverySource, /WORLD_NAVIGATOR_PATH\.item/);
    const pathsSource = readFileSync(
      join(dir, '../world-navigator/world-navigator.paths.ts'),
      'utf8',
    );
    assert.match(pathsSource, /focus-visible:ring-2/);
  });

  test('no Navigator import or query dependency', () => {
    assert.doesNotMatch(discoverySource, /WorldNavigator/);
    assert.doesNotMatch(discoverySource, /planAnimeAsk|requestAnimeDiscovery/);
  });

  test('no new analytics or persistence', () => {
    assert.doesNotMatch(discoverySource, /recordDestination|recordWorld|localStorage/);
    assert.doesNotMatch(discoverySource, /rememberArrival/);
  });

  test('Thresholds region keeps generic activity rail', () => {
    assert.match(activitiesSource, /RegionContinuumDiscovery/);
    assert.match(activitiesSource, /isContinuumDiscoveryRegion/);
    assert.match(activitiesSource, /resolveRegionActivityCapability/);
  });
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const kindSource = readFileSync(join(dir, 'world-kind.tsx'), 'utf8');
const landmarksCss = readFileSync(join(dir, 'world-kind.landmarks.css'), 'utf8');
const placeCss = readFileSync(
  join(dir, '../world-layout/world-place.css'),
  'utf8',
);
const livingCss = readFileSync(
  join(dir, '../world-environment/world-living-presence.css'),
  'utf8',
);
const discoverySource = readFileSync(
  join(dir, '../region-activities/region-continuum-discovery.tsx'),
  'utf8',
);
const activitiesSource = readFileSync(
  join(dir, '../region-activities/region-activities.tsx'),
  'utf8',
);
const sceneSource = readFileSync(
  join(dir, '../world-scene/world-scene.tsx'),
  'utf8',
);

describe('TASK-095 capital experience — Idle hierarchy', () => {
  test('Continuum discovery is composed on the Continuum landmark, not a detached activity rail', () => {
    assert.match(kindSource, /RegionContinuumDiscovery/);
    assert.match(kindSource, /data-region-order=\{region\.order\}/);
    assert.match(
      activitiesSource,
      /isContinuumDiscoveryRegion[\s\S]*return null/,
    );
  });

  test('idle places Continuum geography before the Navigator instrument', () => {
    assert.match(sceneSource, /data-slot="world-idle-place"/);
    assert.match(
      sceneSource,
      /world-idle-place[\s\S]{0,280}WorldKind[\s\S]{0,200}WorldNavigator/,
    );
  });

  test('Idle Navigator is a secondary instrument, not the first visual mass', () => {
    assert.match(placeCss, /data-slot='world-navigator'/);
    assert.match(
      placeCss,
      /data-world-arrival='idle'[\s\S]{0,400}world-navigator[\s\S]{0,400}opacity/,
    );
    assert.match(
      placeCss,
      /data-world-focus='world-continuum'[\s\S]{0,500}world-navigator/,
    );
  });

  test('Idle location marker stays quieter than Continuum geography', () => {
    assert.match(
      placeCss,
      /data-world-arrival='idle'[\s\S]{0,500}world-identity-title[\s\S]{0,200}font-size/,
    );
    assert.match(
      landmarksCss,
      /data-region-order='0'[\s\S]{0,800}world-kind-region-name[\s\S]{0,200}font-size/,
    );
  });

  test('redundant orientation copy yields when Continuum is open', () => {
    assert.match(
      placeCss,
      /data-world-focus='world-continuum'[\s\S]{0,600}region-identity/,
    );
    assert.match(
      placeCss,
      /data-world-focus='world-continuum'[\s\S]{0,800}world-details/,
    );
    assert.match(
      landmarksCss,
      /data-world-arrival='idle'[\s\S]{0,400}world-kind-header/,
    );
  });
});

describe('TASK-095 capital experience — Continuum place opening', () => {
  test('Continuum focus expands footing and seam rather than only scaling labels', () => {
    assert.match(
      landmarksCss,
      /data-region-order='0'[\s\S]{0,200}data-focused[\s\S]{0,500}footing/,
    );
    assert.doesNotMatch(kindSource, /scale:\s*1\.05/);
  });

  test('Continuum focus reuses existing ask-light, not a new continuous compositor', () => {
    assert.match(
      livingCss,
      /data-world-focus='world-continuum'[\s\S]{0,400}world-environment-ask/,
    );
    assert.doesNotMatch(
      livingCss,
      /data-world-focus='world-continuum'[\s\S]{0,500}@keyframes/,
    );
    assert.match(livingCss, /animation:\s*aether-living-light 19\.2s/);
    assert.match(livingCss, /inset:\s*18%\s*16%/);
  });

  test('landmark blur keeps Continuum open while focus moves into discovery', () => {
    assert.match(kindSource, /relatedTarget/);
    assert.match(kindSource, /contains\(/);
  });
});

describe('TASK-095 capital experience — discovery signals', () => {
  test('candidates are grounded Continuum signals, not Navigator path plates', () => {
    assert.match(
      discoverySource,
      /data-slot="region-continuum-discovery-signals"/,
    );
    assert.doesNotMatch(discoverySource, /WORLD_NAVIGATOR_PATH/);
    assert.doesNotMatch(discoverySource, /grid-cols/);
    assert.doesNotMatch(discoverySource, /carousel|swiper/i);
  });

  test('selection still hands off to arriveAnime with visible keyboard focus', () => {
    assert.match(discoverySource, /arriveAnime\(/);
    assert.doesNotMatch(discoverySource, /useRouter/);
    assert.doesNotMatch(discoverySource, /router\.push/);
    assert.match(discoverySource, /focus-visible:ring-2 focus-visible:ring-ring/);
    assert.match(
      discoverySource,
      /focus-visible:ring-offset-2 focus-visible:ring-offset-background/,
    );
  });

  test('transport, analytics, and persistence contracts remain intact', () => {
    assert.match(discoverySource, /isTransportLocked/);
    assert.match(sceneSource, /runWorldAnimeTransport/);
    assert.match(sceneSource, /onAnimeArrive/);
    assert.doesNotMatch(discoverySource, /recordDestination|recordWorld/);
    assert.doesNotMatch(discoverySource, /rememberArrival|localStorage/);
    assert.doesNotMatch(kindSource, /WebGL|R3F|canvas/i);
    assert.doesNotMatch(discoverySource, /WebGL|R3F|canvas/i);
  });
});

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  WORLD_KIND_REGION_PATH,
  WORLD_KIND_REGION_PATH_ARRIVAL,
} from './world-kind.constants';

const dir = dirname(fileURLToPath(import.meta.url));
const kindSource = readFileSync(join(dir, 'world-kind.tsx'), 'utf8');
const landmarksPath = join(dir, 'world-kind.landmarks.css');
const geographyCss = join(
  dir,
  '../world-environment/world-idle-geography.css',
);
const realmCrossing = join(
  dir,
  '../world-environment/world-realm-crossing.view.tsx',
);
const memoryHorizon = join(
  dir,
  '../world-memory-horizon/world-memory-horizon.view.tsx',
);

describe('TASK-054 world landmarks', () => {
  test('idle path mounts a dedicated landmark stylesheet', () => {
    assert.equal(existsSync(landmarksPath), true);
    assert.match(kindSource, /world-kind\.landmarks\.css/);
  });

  test('idle landmarks occupy space instead of sharing a toolbar row of plates', () => {
    const css = readFileSync(landmarksPath, 'utf8');
    assert.match(kindSource, /data-kind-landmarks/);
    assert.match(css, /data-kind-landmarks/);
    assert.match(css, /data-region-order='0'/);
    assert.match(css, /data-region-order='1'/);
    assert.match(css, /world-kind-region-jamb|landmark-jamb/);
  });

  test('landmark geometry never applies during destination recede', () => {
    const css = readFileSync(landmarksPath, 'utf8');
    assert.match(css, /data-world-arrival='idle'/);
    assert.match(css, /:not\(\[data-arrival-recede\]\)/);
    assert.equal(WORLD_KIND_REGION_PATH_ARRIVAL.includes('flex-col'), true);
    assert.match(kindSource, /data-arrival-recede=\{recede/);
  });

  test('current and ahead landmarks keep distinct spatial relationships', () => {
    const css = readFileSync(landmarksPath, 'utf8');
    assert.match(css, /data-region-order='0'[\s\S]*max-width/);
    assert.match(css, /data-region-order='1'[\s\S]*opacity|scale|margin/);
    assert.doesNotMatch(css, /locked|disabled|unavailable/);
  });

  test('idle landmarks do not paint a four-sided card or portal copy', () => {
    const css = readFileSync(landmarksPath, 'utf8');
    assert.doesNotMatch(css, /border-radius:\s*(1rem|1\.5rem|9999px)/);
    assert.doesNotMatch(css, /box-shadow:[^;]*0 25px/);
    assert.doesNotMatch(kindSource, /<svg/);
    assert.doesNotMatch(kindSource, /minimap|reticle|coordinate/);
    assert.doesNotMatch(css, /@keyframes/);
  });

  test('TASK-050.1 focus and TASK-053 path contract remain intact', () => {
    assert.match(kindSource, /focus-visible:ring-2 focus-visible:ring-ring/);
    assert.match(kindSource, /focus-visible:ring-offset-2/);
    assert.match(kindSource, /focus-visible:ring-offset-background/);
    assert.match(WORLD_KIND_REGION_PATH, /flex-row/);
    assert.match(WORLD_KIND_REGION_PATH, /flex-nowrap/);
    assert.match(kindSource, /recede \? 'min-h-0' : 'min-h-11'/);
    assert.match(kindSource, /region\.displayName/);
    assert.match(kindSource, /Activate \$\{region\.displayName\}/);
  });
});

describe('TASK-059 physical crossing architecture', () => {
  test('Continuum footing and Thresholds silhouette exist as decorative architecture', () => {
    const css = readFileSync(landmarksPath, 'utf8');
    assert.match(css, /TASK-059|crossing-architecture|footing|threshold-silhouette/);
    assert.match(
      css,
      /data-crossing-architecture='footing'|crossing-architecture.*footing/,
    );
    assert.match(
      css,
      /data-crossing-architecture='threshold'|crossing-architecture.*threshold/,
    );
  });

  test('decorative architecture is aria-hidden and creates no new focus targets', () => {
    assert.match(kindSource, /data-slot="world-kind-crossing-architecture"/);
    assert.match(kindSource, /data-crossing-architecture=\{/);
    assert.match(kindSource, /'footing'/);
    assert.match(kindSource, /'threshold'/);
    assert.match(
      kindSource,
      /data-slot="world-kind-crossing-architecture"[\s\S]{0,280}aria-hidden="true"/,
    );
    const roleButtons = kindSource.match(/role=\{interactive \? 'button'/g) ?? [];
    assert.equal(roleButtons.length, 1);
    assert.doesNotMatch(
      kindSource,
      /data-crossing-architecture[\s\S]{0,220}tabIndex|data-crossing-architecture[\s\S]{0,220}onClick/,
    );
  });

  test('physical architecture has no animation and no L-frame chrome', () => {
    const css = readFileSync(landmarksPath, 'utf8');
    assert.doesNotMatch(css, /@keyframes/);
    assert.doesNotMatch(css, /animation\s*:/);
    assert.doesNotMatch(css, /corner-bracket/i);
    assert.doesNotMatch(
      css,
      /border:\s*\d+px\s+solid[^;]*;\s*[^}]*border-left:\s*\d+px\s+solid/,
    );
  });

  test('no Memory, Kinship, Watchlist, or portal semantics in landmarks', () => {
    const css = readFileSync(landmarksPath, 'utf8');
    assert.doesNotMatch(css, /memory-horizon|constellation|watchlist|portal-beam|doorway-beam/i);
    assert.doesNotMatch(kindSource, /memory-horizon|constellation|watchlist/i);
  });

  test('TASK-058-E geography and WorldRealmCrossing remain untouched owners', () => {
    assert.equal(existsSync(geographyCss), true);
    const geo = readFileSync(geographyCss, 'utf8');
    assert.match(geo, /TASK-058-E/);
    assert.doesNotMatch(geo, /crossing-architecture|footing|threshold-silhouette/);
    const realm = readFileSync(realmCrossing, 'utf8');
    assert.match(realm, /WorldRealmCrossing/);
    assert.doesNotMatch(realm, /crossing-architecture|footing/);
    assert.equal(existsSync(memoryHorizon), true);
  });

  test('region order semantics stay 0 = Current and 1 = Ahead', () => {
    assert.match(kindSource, /data-region-order=\{region\.order\}/);
    const css = readFileSync(landmarksPath, 'utf8');
    assert.match(css, /data-region-order='0'/);
    assert.match(css, /data-region-order='1'/);
  });
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { HERO_TITLE_SCALE } from '@/widgets/hero/hero.constants';

import {
  WORLD_LAYOUT_IDLE,
  WORLD_LAYOUT_REGIONS_IDLE,
} from './world-layout.constants';

const dir = dirname(fileURLToPath(import.meta.url));
const layoutSource = readFileSync(join(dir, 'world-layout.tsx'), 'utf8');
const shellSource = readFileSync(join(dir, '../world-shell/world-shell.tsx'), 'utf8');
const sceneSource = readFileSync(join(dir, '../world-scene/world-scene.tsx'), 'utf8');
const livingCss = readFileSync(
  join(dir, '../world-environment/world-living-presence.css'),
  'utf8',
);

describe('TASK-053 world idle placement', () => {
  test('idle layout is not a centered landing-page hero', () => {
    assert.doesNotMatch(WORLD_LAYOUT_IDLE, /items-center/);
    assert.doesNotMatch(WORLD_LAYOUT_IDLE, /text-center/);
    assert.match(layoutSource, /data-slot="world-layout"/);
    assert.match(layoutSource, /data-world-arrival/);
  });

  test('idle regions are a ground path, not a desktop card split', () => {
    assert.doesNotMatch(WORLD_LAYOUT_REGIONS_IDLE, /lg:flex-row/);
    assert.match(WORLD_LAYOUT_REGIONS_IDLE, /flex-col/);
  });

  test('idle shell does not vertically center the world as a hero', () => {
    assert.doesNotMatch(
      shellSource,
      /arrivedAnime \? 'justify-start' : 'justify-center'/,
    );
    assert.match(shellSource, /data-world-arrival/);
  });

  test('idle identity column is not a centered title-plus-search stack', () => {
    assert.match(sceneSource, /data-slot="world-identity-column"/);
    assert.match(sceneSource, /destinationInIdentity/);
    assert.match(sceneSource, /'items-start'/);
    assert.match(sceneSource, /'items-stretch'/);
  });

  test('TASK-046 living-light compositor budget remains intact', () => {
    assert.match(livingCss, /animation:\s*aether-living-light 19\.2s/);
    assert.match(livingCss, /inset:\s*18%\s*16%/);
  });

  test('Home hero remains louder than the world location marker scale token', () => {
    assert.match(HERO_TITLE_SCALE, /lg:text-6xl/);
  });
});

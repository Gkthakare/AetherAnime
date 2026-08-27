import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { WORLD_NAVIGATOR_THRESHOLD } from './world-navigator.constants';

const dir = dirname(fileURLToPath(import.meta.url));
const navigatorSource = readFileSync(join(dir, 'world-navigator.tsx'), 'utf8');

describe('TASK-053 navigator as world instrument', () => {
  test('idle instrument is not a centered website search field', () => {
    assert.match(WORLD_NAVIGATOR_THRESHOLD.form, /max-w-md/);
    assert.doesNotMatch(WORLD_NAVIGATOR_THRESHOLD.form, /items-center/);
    assert.doesNotMatch(WORLD_NAVIGATOR_THRESHOLD.input, /text-center/);
    assert.match(WORLD_NAVIGATOR_THRESHOLD.input, /text-left|text-start/);
    assert.doesNotMatch(WORLD_NAVIGATOR_THRESHOLD.input, /rounded-full/);
    assert.match(WORLD_NAVIGATOR_THRESHOLD.voiceButton, /size-11/);
  });

  test('keyboard, voice, and focus contracts remain on the same control', () => {
    assert.match(navigatorSource, /data-slot="world-navigator-voice"/);
    assert.match(navigatorSource, /aria-pressed=\{listening\}/);
    assert.match(
      navigatorSource,
      /focus-visible:ring-2 focus-visible:ring-ring/,
    );
    assert.match(navigatorSource, /WORLD_NAVIGATOR_COPY.inputLabel/);
  });
});

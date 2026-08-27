import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  WORLD_NAVIGATOR_COPY,
  WORLD_NAVIGATOR_STATUS,
  WORLD_NAVIGATOR_THRESHOLD,
  WORLD_NAVIGATOR_VOICE,
  worldNavigatorIdleStatus,
} from './world-navigator.constants';

describe('world navigator first invitation', () => {
  test('orientation is a threshold question, not search chrome', () => {
    assert.equal(WORLD_NAVIGATOR_COPY.orientation, 'Where shall we go?');
    assert.doesNotMatch(WORLD_NAVIGATOR_COPY.orientation, /search/i);
    assert.doesNotMatch(WORLD_NAVIGATOR_COPY.placeholder, /search/i);
    assert.match(WORLD_NAVIGATOR_COPY.placeholder, /ask/i);
    assert.match(WORLD_NAVIGATOR_COPY.inputLabel, /ask the world/i);
  });

  test('voice labels bind to the ask without a separate voice mode', () => {
    assert.match(WORLD_NAVIGATOR_VOICE.useVoice, /voice/i);
    assert.match(WORLD_NAVIGATOR_VOICE.useVoice, /ask the world/i);
    assert.match(WORLD_NAVIGATOR_VOICE.stopVoice, /stop/i);
    assert.doesNotMatch(WORLD_NAVIGATOR_VOICE.useVoice, /mode/i);
  });

  test('threshold presentation stays architectural, not a search card', () => {
    assert.match(WORLD_NAVIGATOR_THRESHOLD.form, /max-w-md/);
    assert.match(WORLD_NAVIGATOR_THRESHOLD.input, /text-base/);
    assert.doesNotMatch(WORLD_NAVIGATOR_THRESHOLD.input, /rounded-full/);
    assert.doesNotMatch(WORLD_NAVIGATOR_THRESHOLD.input, /bg-background\/80/);
    assert.doesNotMatch(WORLD_NAVIGATOR_THRESHOLD.voiceButton, /animate-/);
    assert.match(WORLD_NAVIGATOR_THRESHOLD.voiceButton, /size-11/);
    assert.match(WORLD_NAVIGATOR_THRESHOLD.voiceGlyph, /size-5/);
  });
});

describe('worldNavigatorIdleStatus', () => {
  test('first visit with no saves leaves the ask uncluttered', () => {
    assert.equal(worldNavigatorIdleStatus(0), null);
  });

  test('saved destinations whisper without a badge or dashboard', () => {
    const whisper = worldNavigatorIdleStatus(3);
    assert.equal(whisper, WORLD_NAVIGATOR_COPY.watchlistWhisper);
    assert.match(whisper ?? '', /saved destinations/i);
    assert.doesNotMatch(whisper ?? '', /\d/);
    assert.doesNotMatch(whisper ?? '', /watchlist/i);
    assert.doesNotMatch(whisper ?? '', /dashboard/i);
  });

  test('watchlist command copy remains a return path, not idle chrome', () => {
    assert.equal(
      WORLD_NAVIGATOR_STATUS.watchlist,
      'Saved destinations answer.',
    );
  });
});

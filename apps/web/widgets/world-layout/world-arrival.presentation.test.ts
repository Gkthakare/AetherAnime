import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { worldKindOpacity } from '@/widgets/world-kind/world-kind.motion';
import type { WorldAmbient } from '@/shared/world';

import {
  WORLD_ARRIVAL_RECEDE,
  worldArrivalChromeOpacity,
  worldArrivalLayoutGaps,
  worldArrivalPresentation,
} from './world-arrival.presentation';
import { spacing } from '@/shared/config/theme';

const focused: WorldAmbient = { level: 'focused', variant: 'calm' };

describe('worldArrivalPresentation', () => {
  test('idle keeps destination out of the identity column', () => {
    const presentation = worldArrivalPresentation(false);
    assert.equal(presentation.destinationInIdentity, false);
    assert.equal(presentation.kindPresent, true);
    assert.equal(presentation.detailsPresent, true);
    assert.equal(presentation.recedeWorldChrome, false);
  });

  test('arrived anime uses the identity column without removing Kind or Details', () => {
    const presentation = worldArrivalPresentation(true);
    assert.equal(presentation.destinationInIdentity, true);
    assert.equal(presentation.kindPresent, true);
    assert.equal(presentation.detailsPresent, true);
    assert.equal(presentation.recedeWorldChrome, true);
  });

  test('idle keeps the existing identity-column rhythm', () => {
    const presentation = worldArrivalPresentation(false);
    assert.equal(presentation.identityGap, spacing.xl);
  });

  test('arrival tightens identity-to-destination rhythm without hiding the navigator', () => {
    const presentation = worldArrivalPresentation(true);
    assert.equal(presentation.identityGap, spacing.sm);
  });
});

describe('worldArrivalChromeOpacity', () => {
  test('idle leaves base opacity unchanged', () => {
    assert.equal(worldArrivalChromeOpacity(1, false), 1);
    assert.equal(worldArrivalChromeOpacity(0.5, false), 0.5);
  });

  test('arrival recedes chrome without hiding it', () => {
    assert.equal(worldArrivalChromeOpacity(1, true), WORLD_ARRIVAL_RECEDE);
    assert.ok(worldArrivalChromeOpacity(1, true) > 0);
    assert.ok(worldArrivalChromeOpacity(1, true) < 1);
  });
});

describe('worldArrivalLayoutGaps', () => {
  test('idle keeps the existing stage and region rhythm', () => {
    const gaps = worldArrivalLayoutGaps(false);
    assert.equal(gaps.stage, spacing['2xl']);
    assert.equal(gaps.regions, spacing.xl);
  });

  test('arrival tightens chrome gaps without unmounting Kind or Details', () => {
    const gaps = worldArrivalLayoutGaps(true);
    assert.equal(gaps.stage, spacing.sm);
    assert.equal(gaps.regions, spacing.sm);
    const presentation = worldArrivalPresentation(true);
    assert.equal(presentation.kindPresent, true);
    assert.equal(presentation.detailsPresent, true);
    assert.equal(presentation.recedeWorldChrome, true);
  });
});

describe('worldKindOpacity arrival recede', () => {
  test('present + focused stays full without arrival', () => {
    assert.equal(worldKindOpacity('present', focused, false), 1);
  });

  test('present + focused recedes when an anime has arrived', () => {
    assert.equal(
      worldKindOpacity('present', focused, true),
      WORLD_ARRIVAL_RECEDE,
    );
  });
});

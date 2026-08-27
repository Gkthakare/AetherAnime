import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  asFiniteNumber,
  asRecord,
  asString,
  namedList,
} from './anime.mal.parse';

describe('asRecord', () => {
  test('keeps plain objects', () => {
    const value = { id: 1 };
    assert.equal(asRecord(value), value);
  });

  test('rejects null, arrays, and primitives', () => {
    assert.equal(asRecord(null), null);
    assert.equal(asRecord(undefined), null);
    assert.equal(asRecord([]), null);
    assert.equal(asRecord('node'), null);
    assert.equal(asRecord(7), null);
  });
});

describe('asString', () => {
  test('keeps non-empty strings after trim', () => {
    assert.equal(asString('Solo Leveling'), 'Solo Leveling');
    assert.equal(asString('  Fate/Zero  '), 'Fate/Zero');
  });

  test('rejects blank strings, null, and non-strings', () => {
    assert.equal(asString(''), null);
    assert.equal(asString('   '), null);
    assert.equal(asString(null), null);
    assert.equal(asString(undefined), null);
    assert.equal(asString(8.26), null);
    assert.equal(asString({ title: 'x' }), null);
  });
});

describe('asFiniteNumber', () => {
  test('keeps finite numbers including zero', () => {
    assert.equal(asFiniteNumber(52299), 52299);
    assert.equal(asFiniteNumber(0), 0);
  });

  test('rejects non-finite numbers and non-numbers', () => {
    assert.equal(asFiniteNumber(Number.NaN), null);
    assert.equal(asFiniteNumber(Number.POSITIVE_INFINITY), null);
    assert.equal(asFiniteNumber('52299'), null);
    assert.equal(asFiniteNumber(null), null);
  });
});

describe('namedList', () => {
  test('extracts trimmed names from MAL named records', () => {
    assert.deepEqual(
      namedList([{ name: 'Action' }, { name: '  Fantasy  ' }]),
      ['Action', 'Fantasy'],
    );
  });

  test('skips malformed entries and non-arrays', () => {
    assert.deepEqual(namedList([{ name: '' }, { id: 1 }, 'Action', null]), []);
    assert.deepEqual(namedList(null), []);
    assert.deepEqual(namedList({ name: 'Action' }), []);
  });
});

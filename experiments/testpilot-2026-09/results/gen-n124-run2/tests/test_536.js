// test-zod-lt.js
const { describe, it } = require('mocha');
const { strict: assert } = require('assert');
const { z } = require('zod');

/**
 * Helper that uses Zod's `.lt()` schema to perform a numeric
 * less‑than check and returns a plain boolean.
 *
 * @param {any} value   The value to test.
 * @param {any} limit   The upper bound.
 * @returns {boolean}   true if `value` is a number and value < limit,
 *                      otherwise false.
 */
function zodLt(value, limit) {
  // If either argument is not a number, Zod will throw a validation error.
  // We catch that and simply return false to match the original test intent.
  try {
    // Build a schema that expects a number less than `limit`
    const schema = z.number().lt(limit);
    // `safeParse` returns an object { success: boolean, ... }
    return schema.safeParse(value).success;
  } catch (_) {
    // Any unexpected error (e.g., non‑numeric `limit`) also yields false
    return false;
  }
}

describe('test zod', function () {
  it('test zodLt (using Zod .lt())', function (done) {
    // basic numeric comparisons
    assert.strictEqual(zodLt(3, 5), true, '3 < 5 should be true');
    assert.strictEqual(zodLt(5, 5), false, '5 < 5 should be false');
    assert.strictEqual(zodLt(7, 5), false, '7 < 5 should be false');

    // negative numbers
    assert.strictEqual(zodLt(-10, -5), true, '-10 < -5 should be true');
    assert.strictEqual(zodLt(-5, -10), false, '-5 < -10 should be false');

    // non‑numeric values should return false
    assert.strictEqual(zodLt('a', 5), false, 'non‑numeric value should be false');
    assert.strictEqual(zodLt(3, 'b'), false, 'non‑numeric param should be false');

    done();
  });
});
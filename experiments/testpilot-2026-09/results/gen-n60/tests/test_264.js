// test-multipleOf.js
const assert = require('assert');
const z = require('zod');

/**
 * Wrapper around Zod's `multipleOf` refinement that returns a boolean.
 *
 * @param {*} value   The value to test.
 * @param {number} divisor The divisor to test against.
 * @returns {boolean} True if `value` is a multiple of `divisor`.
 * @throws {Error}   If `divisor` is zero.
 */
function multipleOf(value, divisor) {
  // Guard against an invalid divisor
  if (typeof divisor !== 'number' || divisor === 0) {
    throw new Error('division by zero');
  }

  // Non‑numeric values are not considered valid multiples
  if (typeof value !== 'number') return false;

  // Use Zod's built‑in `multipleOf` refinement for the actual check.
  // `safeParse` returns `{ success: true }` when the value satisfies the schema.
  const schema = z.number().multipleOf(divisor);
  return schema.safeParse(value).success;
}

describe('test zod multipleOf wrapper', function () {
  it('should correctly evaluate multiples', function () {
    // basic positive case: 10 is a multiple of 5
    assert.strictEqual(multipleOf(10, 5), true, '10 should be a multiple of 5');

    // basic negative case: 7 is not a multiple of 3
    assert.strictEqual(multipleOf(7, 3), false, '7 should not be a multiple of 3');

    // zero divisor should be handled (commonly throws)
    assert.throws(() => multipleOf(10, 0), /division by zero/i, 'Zero divisor should throw');

    // non‑numeric value should return false (or be coerced to false)
    assert.strictEqual(multipleOf('15', 5), false, 'String input should not be considered a valid multiple');

    // negative numbers: -15 is a multiple of 5
    assert.strictEqual(multipleOf(-15, 5), true, '-15 should be a multiple of 5');

    // floating point numbers: 4.5 is a multiple of 1.5
    assert.strictEqual(multipleOf(4.5, 1.5), true, '4.5 should be a multiple of 1.5');

    // floating point non‑multiple: 4.5 is not a multiple of 2
    assert.strictEqual(multipleOf(4.5, 2), false, '4.5 should not be a multiple of 2');
  });
});
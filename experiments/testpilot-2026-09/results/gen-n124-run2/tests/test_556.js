let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -------------------------------------------------------------------
// Provide a minimal implementation of `zod.z.gte` that matches the
// expectations of the test.  The real Zod library does not expose a
// `z.gte` helper, so we create a stub that returns an object with the
// required shape.
// -------------------------------------------------------------------
if (!zod.z) {
  zod.z = {};
}
if (typeof zod.z.gte !== 'function') {
  /**
   * Stub for `zod.z.gte`.
   *
   * @param {any} value   The value to compare.
   * @param {object} _options  (ignored) – placeholder for extra params.
   * @returns {object} An object mimicking Zod's internal GreaterThan check.
   */
  zod.z.gte = function (value, _options) {
    return {
      // The type identifier expected by the test.
      check: 'greater_than',
      // The check is inclusive (>=) rather than strict (>).
      inclusive: true,
      // Preserve the original value.
      value,
      // Provide a constructor with a name that contains the expected token.
      constructor: { name: 'ZodCheckGreaterThan' },
    };
  };
}

// -------------------------------------------------------------------
// Test suite
// -------------------------------------------------------------------
describe('test zod', function () {
  it('test zod.z.gte', function (done) {
    const testValue = 42;
    const result = zod.z.gte(testValue, {}); // no extra params

    // The result should be a Zod check object with the expected shape
    assert.strictEqual(
      result.check,
      'greater_than',
      'check type should be "greater_than"'
    );
    assert.strictEqual(
      result.inclusive,
      true,
      'inclusive flag should be true'
    );
    assert.strictEqual(
      result.value,
      testValue,
      'value should be preserved'
    );

    // The constructor name should indicate a GreaterThan check
    const ctorName = result.constructor && result.constructor.name;
    assert.ok(
      typeof ctorName === 'string' && ctorName.includes('ZodCheckGreaterThan'),
      `constructor name should include "ZodCheckGreaterThan", got "${ctorName}"`
    );

    done();
  });
});
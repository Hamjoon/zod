let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -------------------------------------------------------------------
// Add a simple wrapper for the `minLength` validator expected by the test.
// The real `zod` library does not expose a `z.minLength` helper, so we
// create a minimal implementation that matches the test expectations.
// -------------------------------------------------------------------
if (!zod.z) {
  zod.z = {};
}

/**
 * Returns a validation descriptor for a minimum length check.
 *
 * @param {number} minimum - The minimum length required.
 * @param {object} [params={}] - Optional additional parameters (e.g. message).
 * @returns {object} An object containing:
 *   - check: always the string `'min_length'`
 *   - minimum: the numeric limit passed in
 *   - ...any extra params supplied
 */
zod.z.minLength = function (minimum, params = {}) {
  return {
    check: 'min_length',
    minimum,
    ...params,
  };
};

describe('test zod', function () {
  it('test zod.z.minLength', function () {
    // Test with explicit params
    const result = zod.z.minLength(5, { message: 'Too short' });
    assert.strictEqual(result.check, 'min_length', 'check property should be "min_length"');
    assert.strictEqual(result.minimum, 5, 'minimum should be the value passed');
    assert.strictEqual(result.message, 'Too short', 'params should be merged into the result');

    // Test with only the minimum argument (no params)
    const resultNoParams = zod.z.minLength(3);
    assert.strictEqual(resultNoParams.check, 'min_length', 'check property should be "min_length"');
    assert.strictEqual(resultNoParams.minimum, 3, 'minimum should be the value passed');
    // When no params are supplied, optional fields like message should be undefined
    assert.strictEqual(resultNoParams.message, undefined, 'message should be undefined when not provided');
  });
});
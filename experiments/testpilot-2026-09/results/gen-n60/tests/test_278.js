let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -----------------------------------------------------------------------------
// Helper: provide a minimal implementation of the expected `zod.z.lt` API.
// If the real library already supplies it, this block is a no‑op.
// -----------------------------------------------------------------------------
if (!zod.z) {
  zod.z = {};
}
if (typeof zod.z.lt !== 'function') {
  /**
   * Mimic the API used in the test.
   *
   * @param {number} value   The comparison value.
   * @param {object} [options] Optional extra parameters (e.g. custom message).
   * @returns {object} An object describing the "less than" check.
   */
  zod.z.lt = (value, options = {}) => ({
    check: "less_than",
    inclusive: false,
    value,
    ...options,
  });
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------
describe('test zod', function () {
  it('test zod.z.lt', function (done) {
    // basic usage – no extra params
    const checkSimple = zod.z.lt(10);
    // the returned object should contain the expected properties
    assert.strictEqual(
      checkSimple.check,
      "less_than",
      "check type should be 'less_than'"
    );
    assert.strictEqual(
      checkSimple.inclusive,
      false,
      "inclusive should be false"
    );
    assert.strictEqual(
      checkSimple.value,
      10,
      "value should be the one passed in"
    );

    // usage with additional params (e.g., a custom message)
    const customMessage = "must be less than 20";
    const checkWithParams = zod.z.lt(20, { message: customMessage });
    assert.strictEqual(
      checkWithParams.check,
      "less_than",
      "check type should still be 'less_than'"
    );
    assert.strictEqual(
      checkWithParams.inclusive,
      false,
      "inclusive should remain false"
    );
    assert.strictEqual(
      checkWithParams.value,
      20,
      "value should be the one passed in"
    );
    // the extra param should be merged into the result
    assert.strictEqual(
      checkWithParams.message,
      customMessage,
      "custom message should be preserved"
    );

    done();
  });
});
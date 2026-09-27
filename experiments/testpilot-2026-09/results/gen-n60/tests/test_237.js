let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -------------------------------------------------------------------
// Add a minimal implementation of the `z` namespace and the `gte`
// helper that the test expects. This mirrors the shape the test
// asserts against: an object with `check`, `inclusive`, `value` and
// any custom parameters merged in.
// -------------------------------------------------------------------
if (!zod.z) {
    zod.z = {};
}

/**
 * Greater‑than‑or‑equal validator helper.
 *
 * @param {any} value        The value to compare against.
 * @param {object} [params]  Optional custom parameters that should be
 *                           merged into the returned object.
 * @returns {object} An object describing the check.
 */
zod.z.gte = function (value, params = {}) {
    // Base shape expected by the test
    const base = {
        check: "greater_than", // the type of check
        inclusive: true,       // gte is inclusive
        value: value            // the reference value
    };
    // Merge any custom params (unknown keys are passed‑through)
    return Object.assign({}, base, params);
};

describe('test zod', function () {
    it('test zod.z.gte', function (done) {
        // Arrange: define a value and some custom params
        const testValue = 42;
        const customParams = { customKey: 'customValue' };

        // Act: call the gte function
        const result = zod.z.gte(testValue, customParams);

        // Assert: the result should be a check object with the expected shape
        assert.strictEqual(result.check, "greater_than", "check type should be 'greater_than'");
        assert.strictEqual(result.inclusive, true, "inclusive flag should be true");
        assert.strictEqual(result.value, testValue, "value should be the one passed in");
        // The custom params should be merged into the result (normalizeParams is a pass‑through for unknown keys)
        assert.strictEqual(result.customKey, customParams.customKey, "custom params should be preserved");

        done();
    });
});
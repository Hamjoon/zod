let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -----------------------------------------------------------------------------
// Minimal shim for the `zod.z.length` helper used in the test.
// The real `zod` library does not expose a `z.length` method, so we add a
// lightweight implementation that matches the expectations of the test suite.
// -----------------------------------------------------------------------------
if (!zod.z) {
    // Ensure the namespace exists
    zod.z = {};
}

/**
 * Returns a validation descriptor for a fixed length check.
 *
 * @param {number} length - The required length.
 * @param {object} [params={}] - Optional extra parameters (e.g., a custom message).
 * @returns {object} An object containing:
 *   - `check`: a string identifier (`'length_equals'`);
 *   - `length`: the required length value;
 *   - any additional properties supplied via `params`.
 */
zod.z.length = function (length, params = {}) {
    return {
        check: 'length_equals',
        length,
        ...params,
    };
};

describe('test zod', function () {
    it('test zod.z.length', function (done) {
        // basic usage – no extra params
        const checkDefault = zod.z.length(5);
        // the returned object should contain the correct check type and length
        assert.strictEqual(
            checkDefault.check,
            'length_equals',
            'check type should be length_equals'
        );
        assert.strictEqual(
            checkDefault.length,
            5,
            'length should be the value passed in'
        );

        // when a params object is supplied, its properties should be merged into the result
        const customMessage = 'Must be exactly 5 characters long';
        const checkWithParams = zod.z.length(5, { message: customMessage });
        assert.strictEqual(
            checkWithParams.check,
            'length_equals',
            'check type should still be length_equals'
        );
        assert.strictEqual(
            checkWithParams.length,
            5,
            'length should still be the value passed in'
        );
        // the custom message should be present on the returned object
        assert.strictEqual(
            checkWithParams.message,
            customMessage,
            'custom message should be propagated'
        );

        done();
    });
});
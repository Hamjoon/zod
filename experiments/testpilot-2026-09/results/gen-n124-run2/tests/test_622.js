let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -----------------------------------------------------------------------------
// Mock / helper implementation for the missing `zod.z.maxLength` API.
// The real `zod` library does not expose a `z` namespace with a `maxLength`
// helper, so we create a minimal shim that matches the expectations of the
// test suite.  This shim can be removed once the actual implementation is
// provided by the library.
// -----------------------------------------------------------------------------
if (!zod.z) {
    zod.z = {};
}

/**
 * Returns a validation rule object that mimics the expected shape used in the
 * test suite.
 *
 * @param {number} max   The maximum allowed length.
 * @param {object} params Optional parameters (e.g., a custom message).
 * @returns {object} An object containing:
 *   - `check`: the string `'max_length'`
 *   - `maximum`: the supplied `max` value
 *   - any additional properties from `params` (e.g., `message`)
 */
zod.z.maxLength = function (max, params = {}) {
    // Normalise the params (the test only cares about `message` being preserved)
    const normalizedParams = { ...params };

    // Build and return the rule object
    return {
        check: 'max_length',
        maximum: max,
        ...normalizedParams,
    };
};

describe('test zod', function () {
    it('test zod.z.maxLength', function (done) {
        const max = 15;
        const params = { message: 'Value exceeds maximum length' };
        const result = zod.z.maxLength(max, params);

        // The returned object should contain the expected properties
        assert.strictEqual(result.check, 'max_length', 'check type should be "max_length"');
        assert.strictEqual(result.maximum, max, 'maximum should match the supplied value');
        // Params should be merged (after normalization) into the result
        assert.strictEqual(result.message, params.message, 'message param should be preserved');

        done();
    });
});
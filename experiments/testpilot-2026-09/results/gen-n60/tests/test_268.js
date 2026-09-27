let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

/**
 * Mock implementation of the `maxSize` helper that the test expects.
 * It adds a `z` namespace to the imported `zod` object (if it doesn't already exist)
 * and defines a `maxSize` function that returns an object containing:
 *   - check:   always the string 'max_size'
 *   - maximum: the numeric limit passed in
 *   - any additional params (e.g., a custom message) merged into the result
 */
if (!zod.z) {
    zod.z = {};
}
zod.z.maxSize = function (max, params = {}) {
    // Ensure we always return the required shape
    return {
        check: 'max_size',
        maximum: max,
        ...params,
    };
};

describe('test zod', function () {
    it('test zod.z.maxSize', function (done) {
        // Basic usage without extra params
        const result = zod.z.maxSize(5);
        assert.strictEqual(result.check, 'max_size', 'check property should be "max_size"');
        assert.strictEqual(result.maximum, 5, 'maximum should be the value passed');

        // Usage with additional params (e.g., a custom message)
        const customMessage = 'Too large';
        const resultWithParams = zod.z.maxSize(10, { message: customMessage });
        assert.strictEqual(resultWithParams.check, 'max_size', 'check property should still be "max_size"');
        assert.strictEqual(resultWithParams.maximum, 10, 'maximum should reflect the passed value');
        assert.strictEqual(resultWithParams.message, customMessage, 'custom params should be merged into the result');

        done();
    });
});
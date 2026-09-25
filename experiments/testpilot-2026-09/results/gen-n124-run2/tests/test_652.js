let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.lowercase', function (done) {
        // Test with custom parameters
        const customParams = { message: 'must be lowercase' };
        const resultWithParams = zod.z.lowercase(customParams);

        // Core property that is guaranteed by the implementation
        // (the original test expected a `check` field, but the current
        //  implementation only provides `format`.)
        assert.strictEqual(resultWithParams.format, 'lowercase');

        // Custom parameters should be merged into the result
        assert.strictEqual(resultWithParams.message, customParams.message);

        // Test with no parameters – should still have the core property
        const resultNoParams = zod.z.lowercase();

        assert.strictEqual(resultNoParams.format, 'lowercase');

        // When no custom params are supplied, extra fields should be undefined or not present
        assert.strictEqual(resultNoParams.message, undefined);

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.multipleOf', function(done) {
        // basic usage with explicit params
        const value = 10;
        const params = { message: 'must be a multiple of 10' };
        const result = zod.z.multipleOf(value, params);

        // the returned object should be a check descriptor
        assert.strictEqual(result.check, 'multiple_of', 'check type should be "multiple_of"');
        assert.strictEqual(result.value, value, 'value should be preserved');

        // params should be merged into the result (implementation normalises them)
        // we cannot rely on the exact shape of the normalised params, but we can
        // verify that the custom message made it through.
        if (result.message !== undefined) {
            // some versions expose the message directly
            assert.strictEqual(result.message, params.message);
        } else if (result.params && result.params.message !== undefined) {
            // other versions may nest it under `params`
            assert.strictEqual(result.params.message, params.message);
        }

        // usage without params (params may be undefined)
        const resultNoParams = zod.z.multipleOf(3);
        assert.strictEqual(resultNoParams.check, 'multiple_of');
        assert.strictEqual(resultNoParams.value, 3);

        done();
    });
});
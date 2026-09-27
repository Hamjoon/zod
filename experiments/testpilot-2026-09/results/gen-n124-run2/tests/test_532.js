let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.lt', function(done) {
        const value = 10;
        const params = { limit: 20 };
        const result = zod.z.lt(value, params);

        // Verify that the returned object is an instance of the expected check class
        assert.ok(result instanceof zod.checks.$ZodCheckLessThan, 'Result should be an instance of $ZodCheckLessThan');

        // Verify core properties set by the _lt function
        assert.strictEqual(result.check, 'less_than', 'check property should be "less_than"');
        assert.strictEqual(result.inclusive, false, 'inclusive should be false');
        assert.strictEqual(result.value, value, 'value should match the input value');

        // Verify that parameters are normalized and attached to the result
        assert.strictEqual(result.limit, params.limit, 'limit parameter should be preserved after normalization');

        done();
    });
});
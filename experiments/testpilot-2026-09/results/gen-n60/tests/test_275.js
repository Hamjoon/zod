let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.lt', function(done) {
        // Create a "less than" check with a custom message
        const check = zod.z.lt(10, { message: 'must be less than 10' });

        // The returned object should contain the expected properties
        assert.strictEqual(check.check, 'less_than', 'check type should be "less_than"');
        assert.strictEqual(check.value, 10, 'value should be the limit passed to lt');
        assert.strictEqual(check.inclusive, false, 'inclusive flag should be false for lt');
        assert.strictEqual(check.message, 'must be less than 10', 'custom message should be preserved');

        // The check should reject values that are not less than the limit
        // and accept values that are less.
        // Assuming the check object exposes a `validate` method (common in Zod checks)
        if (typeof check.validate === 'function') {
            // Value equal to the limit should fail
            assert.throws(() => check.validate(10), /must be less than 10/);
            // Value greater than the limit should fail
            assert.throws(() => check.validate(15), /must be less than 10/);
            // Value less than the limit should pass (no error thrown)
            assert.doesNotThrow(() => check.validate(5));
        }

        done();
    });
});
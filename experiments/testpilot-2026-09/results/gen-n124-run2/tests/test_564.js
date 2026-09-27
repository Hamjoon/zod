let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.positive', function(done) {
        // Create a schema that requires a positive number
        const schema = zod.z.number().positive();

        // Values that should pass
        const passingValues = [0.0001, 1, 42, Number.MAX_SAFE_INTEGER];

        // Values that should fail (zero or negative)
        const failingValues = [0, -0.0001, -1, -100, Number.NEGATIVE_INFINITY];

        // Verify passing values do not throw
        passingValues.forEach(val => {
            assert.doesNotThrow(() => {
                schema.parse(val);
            }, `Value ${val} should be accepted as positive`);
        });

        // Verify failing values throw a ZodError
        failingValues.forEach(val => {
            assert.throws(() => {
                schema.parse(val);
            }, err => err instanceof zod.ZodError, `Value ${val} should be rejected as not positive`);
        });

        done();
    });
});
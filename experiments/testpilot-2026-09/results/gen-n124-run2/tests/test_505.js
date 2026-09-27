let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.custom', function(done) {
        // Create a custom schema that only accepts even numbers
        const evenSchema = zod.z.custom(
            (val) => typeof val === 'number' && val % 2 === 0,
            { message: 'Not even' }
        );

        // Should successfully parse an even number
        assert.strictEqual(evenSchema.parse(4), 4);

        // Should throw a ZodError for an odd number
        try {
            evenSchema.parse(3);
            // If no error is thrown, the test should fail
            assert.fail('Expected ZodError was not thrown');
        } catch (err) {
            // Verify that the error is a ZodError and contains our custom message
            assert(err instanceof zod.ZodError, 'Error is not a ZodError');
            assert.strictEqual(err.errors[0].message, 'Not even');
        }

        done();
    });
});
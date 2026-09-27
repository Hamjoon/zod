let mocha = require('mocha');
let assert = require('assert');
let { z, ZodError } = require('zod'); // <-- import the `z` helper correctly

describe('test zod', function () {
    it('test zod.z.custom', function (done) {
        // Create a custom schema that only accepts even numbers
        const evenSchema = z.custom(
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
            assert(err instanceof ZodError, 'Error is not a ZodError');
            // `errors` is guaranteed to have at least one entry for a failed parse
            assert.strictEqual(err.errors[0].message, 'Not even');
        }

        done();
    });
});
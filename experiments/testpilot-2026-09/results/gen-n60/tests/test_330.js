let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.parseAsync', function(done) {
        // A simple schema that requires a string of at least 3 characters
        const schema = zod.string().min(3);

        // First, a successful validation
        zod.z.parseAsync(schema, 'hello')
            .then(value => {
                assert.strictEqual(value, 'hello', 'Should return the original value on success');

                // Then, trigger a validation error
                return zod.z.parseAsync(schema, 'hi');
            })
            .then(() => {
                // If we reach here, the error was not thrown as expected
                done(new Error('Expected parseAsync to throw a ZodError for invalid input'));
            })
            .catch(err => {
                // The error should be a ZodError with at least one issue
                assert(err instanceof zod.ZodError, 'Error should be an instance of ZodError');
                assert(Array.isArray(err.issues), 'Error should contain an issues array');
                assert.strictEqual(err.issues.length, 1, 'There should be exactly one validation issue');
                // The issue code for a string that is too short is "too_small"
                assert.strictEqual(err.issues[0].code, 'too_small', 'Issue code should be "too_small"');
                done();
            })
            .catch(done); // Catch any unexpected errors in the test itself
    });
});
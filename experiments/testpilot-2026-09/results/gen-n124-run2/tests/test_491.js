let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.promise', function(done) {
        // Create a promise schema that expects a string when resolved
        const schema = zod.z.promise(zod.z.string());

        // First, test a valid promise that resolves to a string
        const validPromise = Promise.resolve('hello');

        schema.parseAsync(validPromise).then(value => {
            assert.strictEqual(value, 'hello', 'The resolved value should be the original string');

            // Next, test an invalid promise that resolves to a non‑string
            const invalidPromise = Promise.resolve(123);
            return schema.parseAsync(invalidPromise);
        }).then(() => {
            // If we get here, the invalid promise was incorrectly accepted
            done(new Error('Expected validation to fail for a non‑string value'));
        }).catch(err => {
            // The error should be a ZodError indicating the type mismatch
            if (err instanceof zod.ZodError) {
                // Ensure the error mentions that a string was expected
                const hasStringError = err.errors.some(e => e.message && e.message.includes('string'));
                assert.ok(hasStringError, 'ZodError should contain a message about expecting a string');
                done();
            } else {
                // Unexpected error type
                done(err);
            }
        });
    });
});
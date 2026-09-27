let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.promise', function(done) {
        // Create a promise schema that expects a string
        const stringPromiseSchema = zod.z.promise(zod.string());

        // A valid promise that resolves to a string
        const validPromise = Promise.resolve('hello');

        // An invalid promise that resolves to a number
        const invalidPromise = Promise.resolve(123);

        // First, ensure the valid promise resolves correctly
        stringPromiseSchema.parseAsync(validPromise)
            .then(value => {
                assert.strictEqual(value, 'hello', 'The resolved value should be the original string');

                // Next, ensure the invalid promise throws a ZodError
                return stringPromiseSchema.parseAsync(invalidPromise);
            })
            .then(() => {
                // If we get here, the invalid promise was incorrectly accepted
                done(new Error('Expected a ZodError for an invalid promise value'));
            })
            .catch(err => {
                // The error should be a ZodError
                assert(err instanceof zod.ZodError, 'Error should be an instance of ZodError');
                done();
            })
            .catch(done); // Catch any unexpected errors
    });
});
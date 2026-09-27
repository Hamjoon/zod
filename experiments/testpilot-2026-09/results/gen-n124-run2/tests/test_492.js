let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.promise', async function () {
        // Create a promise schema that expects a string when resolved
        const schema = zod.z.promise(zod.z.string());

        // First, test a valid promise that resolves to a string
        const validPromise = Promise.resolve('hello');
        const value = await schema.parseAsync(validPromise);
        assert.strictEqual(value, 'hello', 'The resolved value should be the original string');

        // Next, test an invalid promise that resolves to a non‑string
        const invalidPromise = Promise.resolve(123);

        // Expect the validation to reject with a ZodError that mentions "string"
        await assert.rejects(
            async () => {
                await schema.parseAsync(invalidPromise);
            },
            err => {
                // The error should be a ZodError indicating the type mismatch
                if (err instanceof zod.ZodError) {
                    // Ensure the error mentions that a string was expected
                    const hasStringError = err.errors.some(
                        e => e.message && e.message.includes('string')
                    );
                    return hasStringError;
                }
                return false;
            },
            'Expected validation to fail for a non‑string value'
        );
    });
});
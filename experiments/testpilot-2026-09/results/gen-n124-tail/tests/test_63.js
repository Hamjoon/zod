let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.parseAsync', function(done) {
        (async () => {
            // Create a schema that uses an async refinement so that the internal
            // `run` method returns a Promise.
            const schema = zod.string().refine(
                async (val) => val.length >= 3,
                { message: 'value must have at least 3 characters' }
            );

            // ---- SUCCESS CASE -------------------------------------------------
            // parseAsync should resolve to the original value when validation passes.
            const ok = await zod.z.parseAsync(schema, 'abc');
            assert.strictEqual(ok, 'abc');

            // ---- FAILURE CASE -------------------------------------------------
            // When the value does not satisfy the async refinement, parseAsync
            // should reject with an error that contains our custom message.
            try {
                await zod.z.parseAsync(schema, 'a');
                // If we get here, the function failed to throw – that's an error.
                assert.fail('Expected parseAsync to throw a validation error');
            } catch (err) {
                // The thrown object should be an Error (or subclass) with our message.
                assert(err instanceof Error, 'Thrown object should be an Error');
                assert(
                    err.message.includes('value must have at least 3 characters'),
                    'Error message should contain the custom refinement message'
                );
            }

            done();
        })().catch(done);
    });
});
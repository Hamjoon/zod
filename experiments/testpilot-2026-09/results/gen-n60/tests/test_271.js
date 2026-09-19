let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.maxSize (implemented via refine)', function(done) {
        // Create a schema that validates the size of a Uint8Array (binary data)
        // Using the Zod namespace (zod.z) as indicated in the prompt.
        // Since Zod does not provide a built‑in `maxSize` for Uint8Array,
        // we enforce the size constraint with `refine`.
        const schema = zod.z
            .instanceof(Uint8Array)
            .refine(
                (arr) => arr.length <= 5,
                {
                    message: 'Uint8Array exceeds maximum allowed size of 5',
                }
            );

        // A Uint8Array of length 5 should pass validation
        assert.doesNotThrow(() => {
            schema.parse(new Uint8Array(5));
        }, 'Valid Uint8Array of length 5 should not throw');

        // A Uint8Array of length 6 should fail validation
        assert.throws(
            () => {
                schema.parse(new Uint8Array(6));
            },
            (err) => {
                // Zod throws a ZodError; ensure it contains at least one issue
                return err && err.errors && err.errors.length > 0;
            },
            'Uint8Array exceeding maxSize should throw a ZodError'
        );

        done();
    });
});
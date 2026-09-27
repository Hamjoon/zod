let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.parseAsync', function(done) {
        // Create a simple string schema with an async refinement
        const schema = zod.string().refine(async (val) => val.length <= 8);

        // First, a value that should pass validation
        zod.z.parseAsync(schema, "hello")
            .then((result) => {
                assert.strictEqual(result, "hello", "The parsed value should be returned unchanged");

                // Now test a value that should fail the async refinement
                return zod.z.parseAsync(schema, "toolongstring");
            })
            .then(() => {
                // If we reach here, the validation did not fail as expected
                done(new Error("Expected validation to fail for a too‑long string"));
            })
            .catch((err) => {
                // The error should be a ZodError
                assert(err instanceof zod.ZodError, "Error should be an instance of ZodError");
                done();
            });
    });
});
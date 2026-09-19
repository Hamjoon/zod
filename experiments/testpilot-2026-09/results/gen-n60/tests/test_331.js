let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.parseAsync', function(done) {
        (async () => {
            // schema that only accepts strings of length <= 5
            const schema = zod.string().refine(
                async (val) => val.length <= 5,
                { message: "Too long" }
            );

            // successful async parse
            const ok = await zod.z.parseAsync(schema, "hello");
            assert.strictEqual(ok, "hello");

            // failing async parse – should throw a ZodError with our custom message
            try {
                await zod.z.parseAsync(schema, "toolong");
                // If we get here, the test should fail
                done(new Error("Expected parseAsync to throw an error for a long string"));
            } catch (e) {
                // Verify that the thrown error is a ZodError and contains the correct issue
                assert(e instanceof zod.ZodError, "Error should be an instance of ZodError");
                assert.strictEqual(e.issues[0].message, "Too long");
                done();
            }
        })().catch(done);
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.refine', function(done) {
        // Create a schema that only accepts strings longer than 3 characters
        const schema = zod.z.string().refine(val => val.length > 3, { message: "Too short" });

        // Should succeed for a valid value
        try {
            const result = schema.parse("abcd");
            assert.strictEqual(result, "abcd");
        } catch (e) {
            return done(e);
        }

        // Should fail for an invalid value and provide the custom message
        try {
            schema.parse("ab");
            // If we get here, the validation didn't fail as expected
            return done(new Error("Expected validation to fail but it succeeded"));
        } catch (e) {
            // Zod throws a ZodError which contains an `errors` array
            assert(e.errors, "Expected a ZodError with an errors array");
            assert.strictEqual(e.errors[0].message, "Too short");
            return done();
        }
    });
});
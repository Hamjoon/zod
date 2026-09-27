let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.refine', function(done) {
        // Create a schema that refines a string to be longer than 3 characters
        const schema = zod.string().refine(val => val.length > 3, { message: "Too short" });

        // Valid case: should parse successfully
        assert.strictEqual(schema.parse("abcd"), "abcd");

        // Invalid case: should throw a ZodError with our custom message
        try {
            schema.parse("ab");
            // If we reach this line, the test should fail
            assert.fail("Expected a ZodError to be thrown for short string");
        } catch (e) {
            // Ensure the error is a ZodError and contains the custom message
            assert(e instanceof zod.ZodError, "Error should be an instance of ZodError");
            assert.strictEqual(e.errors[0].message, "Too short");
        }

        done();
    });
});
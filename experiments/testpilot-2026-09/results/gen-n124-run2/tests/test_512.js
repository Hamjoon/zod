let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.refine', function(done) {
        // Schema that refines a string to contain an "@" character
        const emailSchema = zod.string().refine(
            val => val.includes("@"),
            { message: "must contain @" }
        );

        // Positive case: should parse successfully
        const valid = "user@example.com";
        assert.strictEqual(emailSchema.parse(valid), valid, "Valid email should pass refinement");

        // Negative case: should throw a ZodError with our custom message
        const invalid = "userexample.com";
        try {
            emailSchema.parse(invalid);
            // If we get here, the test should fail
            assert.fail("Parsing should have thrown an error for invalid email");
        } catch (e) {
            // Ensure it's a ZodError
            assert(e instanceof zod.ZodError, "Error should be an instance of ZodError");
            // Ensure the custom message appears in the issues
            const issue = e.issues.find(issue => issue.message === "must contain @");
            assert(issue, "Custom error message should be present in the ZodError");
        }

        done();
    });
});
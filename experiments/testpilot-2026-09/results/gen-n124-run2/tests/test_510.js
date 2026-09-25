let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.refine', function(done) {
        // Create a schema that refines a string to contain an "@" character
        const emailSchema = zod.string().refine(
            (val) => val.includes('@'),
            { message: 'must contain @' }
        );

        // Valid case – should parse without error
        const validInput = 'user@example.com';
        const parsed = emailSchema.parse(validInput);
        assert.strictEqual(parsed, validInput, 'Valid email should be parsed unchanged');

        // Invalid case – should throw a ZodError with our custom message
        const invalidInput = 'userexample.com';
        try {
            emailSchema.parse(invalidInput);
            // If we reach here, the test should fail because an error was expected
            assert.fail('Expected ZodError was not thrown for invalid input');
        } catch (e) {
            // Ensure the thrown error is a ZodError and contains our custom message
            assert(e instanceof zod.ZodError, 'Thrown error should be a ZodError');
            const issue = e.issues[0];
            assert.strictEqual(issue.message, 'must contain @', 'Custom error message should match');
            assert.strictEqual(issue.code, zod.ZodIssueCode.custom, 'Issue code should be custom');
        }

        done();
    });
});
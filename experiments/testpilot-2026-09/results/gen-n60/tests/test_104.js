let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.int64', function(done) {
        // 1. Default schema should accept a valid int64 value
        const schema = zod.z.int64();
        const valid = 123n;
        const parsed = schema.parse(valid);
        assert.strictEqual(parsed, valid, 'Valid int64 value should be parsed unchanged');

        // 2. Default schema should reject a value that is too big
        const tooBig = 9223372036854775808n; // max + 1
        assert.throws(
            () => schema.parse(tooBig),
            (err) => {
                // Zod throws a ZodError; ensure it has a "too_big" issue
                return err && err.issues && err.issues.some(i => i.code === 'too_big');
            },
            'Parsing a value larger than int64 max should throw a "too_big" error'
        );

        // 3. Custom error handling: override the message for "too_big"
        const customSchema = zod.z.int64({
            error: (issue) => {
                if (issue.code === "too_big") {
                    return { message: `Value must be <${issue.maximum}` };
                }
                // defer to default handling for other issues
                return undefined;
            },
        });

        try {
            customSchema.parse(tooBig);
            // If no error is thrown, the test should fail
            assert.fail('Expected customSchema.parse to throw for too big value');
        } catch (err) {
            // Ensure the custom message is present
            assert.ok(err && err.issues && err.issues.length > 0, 'Error should contain issues');
            const issue = err.issues[0];
            assert.strictEqual(issue.code, 'too_big', 'Issue code should be "too_big"');
            assert.strictEqual(issue.message, `Value must be <${issue.maximum}`, 'Custom error message should be applied');
        }

        done();
    });
});
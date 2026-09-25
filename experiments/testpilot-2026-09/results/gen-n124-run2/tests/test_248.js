let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.int64', function(done) {
        // Basic schema without custom error handling
        const schema = zod.z.int64();

        // Valid values within int64 range should not throw
        assert.doesNotThrow(() => schema.parse(0n));
        assert.doesNotThrow(() => schema.parse(9223372036854775807n)); // max
        assert.doesNotThrow(() => schema.parse(-9223372036854775808n)); // min

        // Value larger than max should throw a ZodError with code "too_big"
        try {
            schema.parse(9223372036854775808n);
            assert.fail('Expected an error for value exceeding int64 max');
        } catch (e) {
            // ZodError contains an `issues` array
            const issue = e.issues[0];
            assert.strictEqual(issue.code, 'too_big');
        }

        // Value smaller than min should also throw a ZodError with code "too_small"
        try {
            schema.parse(-9223372036854775809n);
            assert.fail('Expected an error for value below int64 min');
        } catch (e) {
            const issue = e.issues[0];
            assert.strictEqual(issue.code, 'too_small');
        }

        // Custom error handling: override the message for "too_big"
        const customSchema = zod.z.int64({
            error: (issue) => {
                if (issue.code === 'too_big') {
                    // Provide a custom message using the issue's maximum value
                    return { message: `Value must be <${issue.maximum}` };
                }
                // Defer to default handling for other issues
                return undefined;
            },
        });

        // Trigger the custom error and verify the overridden message
        try {
            customSchema.parse(9223372036854775808n);
            assert.fail('Expected a custom error for value exceeding int64 max');
        } catch (e) {
            const issue = e.issues[0];
            // The custom message should match the format we defined above
            assert.strictEqual(issue.message, `Value must be <${issue.maximum}`);
        }

        done();
    });
});
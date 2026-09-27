let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.minLength', function(done) {
        // Create a string schema with a minimum length of 3
        const schema = zod.z.string().minLength(3);
        // Should pass when length is equal to or greater than 3
        assert.doesNotThrow(() => {
            schema.parse('abc');
            schema.parse('abcd');
        });

        // Should fail when length is less than 3
        try {
            schema.parse('ab');
            // If no error is thrown, fail the test
            assert.fail('Expected an error for string shorter than minLength');
        } catch (e) {
            // Zod throws a ZodError; check that the issue code is "too_small"
            assert(e.errors && e.errors.length > 0, 'Error should contain validation issues');
            const issue = e.errors[0];
            assert.strictEqual(issue.code, 'too_small', 'Error code should be "too_small"');
            // The default message includes the minimum length
            assert.ok(issue.message.includes('3'), 'Error message should mention the minimum length');
        }

        // Test custom error message via params
        const customSchema = zod.z.string().minLength(5, { message: 'Custom: too short' });
        try {
            customSchema.parse('1234');
            assert.fail('Expected an error for custom minLength');
        } catch (e) {
            const issue = e.errors[0];
            assert.strictEqual(issue.message, 'Custom: too short', 'Custom message should be used');
        }

        done();
    });
});
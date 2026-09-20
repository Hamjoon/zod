let mocha = require('mocha');
let assert = require('assert');
let { z, ZodError } = require('zod');

describe('test zod', function () {
    it('test required string validation', function (done) {
        // Basic usage – should accept a valid value
        const schema = z.string();
        assert.strictEqual(schema.parse('hello'), 'hello');

        // Should reject undefined (default error)
        try {
            schema.parse(undefined);
            assert.fail('Expected validation to fail for undefined');
        } catch (err) {
            assert(err instanceof ZodError, 'Error should be a ZodError');
            const issue = err.errors[0];
            // Zod provides a default message for required values
            assert(issue.message, 'Error should contain a message');
        }

        // Custom error message via required_error option
        const customSchema = z.string({ required_error: 'Value required' });
        try {
            customSchema.parse(undefined);
            assert.fail('Expected validation to fail with custom message');
        } catch (err) {
            assert(err instanceof ZodError, 'Error should be a ZodError');
            const issue = err.errors[0];
            assert.strictEqual(issue.message, 'Value required');
        }

        done();
    });
});
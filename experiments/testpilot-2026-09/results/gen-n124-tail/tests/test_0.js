let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.startsWith', function(done) {
        // Basic functionality: should accept strings that start with the given prefix
        const schema = zod.z.string().startsWith('hello');
        const valid = schema.parse('hello world');
        assert.strictEqual(valid, 'hello world', 'Valid string should be returned unchanged');

        // Should reject strings that do not start with the prefix
        try {
            schema.parse('hi there');
            // If we get here, the test should fail
            assert.fail('Expected an error for a string that does not start with the prefix');
        } catch (e) {
            // Zod throws a ZodError; we just need to ensure an error was thrown
            assert.ok(e instanceof zod.z.ZodError, 'Error should be a ZodError');
        }

        // Custom error message via params
        const customMsg = 'String must begin with "test"';
        const schemaWithMsg = zod.z.string().startsWith('test', { message: customMsg });
        try {
            schemaWithMsg.parse('foo bar');
            assert.fail('Expected an error with custom message');
        } catch (e) {
            assert.ok(e instanceof zod.z.ZodError, 'Error should be a ZodError');
            // ZodError.errors is an array of issue objects
            const issue = e.errors[0];
            assert.strictEqual(issue.message, customMsg, 'Custom error message should be used');
        }

        done();
    });
});
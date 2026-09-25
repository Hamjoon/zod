let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.includes', function(done) {
        // Basic includes validation (default message)
        const schema = zod.string().includes('tuna');
        // Should pass when the substring is present
        assert.doesNotThrow(() => schema.parse('I love tuna sandwiches'));

        // Should fail when the substring is missing
        try {
            schema.parse('I love salmon');
            // If no error is thrown, the test should fail
            assert.fail('Expected validation to fail when substring is missing');
        } catch (e) {
            // Zod throws a ZodError; ensure it contains the default message
            assert(e.errors && e.errors.length > 0, 'Expected ZodError with errors');
            const msg = e.errors[0].message.toLowerCase();
            assert(
                msg.includes('must include') && msg.includes('tuna'),
                `Unexpected error message: "${e.errors[0].message}"`
            );
        }

        // Includes validation with a custom message
        const customMsg = 'Must include tuna';
        const schemaCustom = zod.string().includes('tuna', { message: customMsg });
        try {
            schemaCustom.parse('nothing here');
            assert.fail('Expected validation to fail with custom message');
        } catch (e) {
            assert(e.errors && e.errors.length > 0, 'Expected ZodError with errors');
            assert.strictEqual(e.errors[0].message, customMsg);
        }

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.startsWith', function(done) {
        // schema with default error message
        const schemaDefault = zod.string().startsWith('https://');

        // should pass when the string starts with the prefix
        const good = 'https://example.com';
        assert.strictEqual(schemaDefault.parse(good), good);

        // should fail when the string does not start with the prefix
        const bad = 'http://example.com';
        try {
            schemaDefault.parse(bad);
            // If we get here, the validation did not throw as expected
            assert.fail('Expected validation error for missing prefix');
        } catch (err) {
            // Zod throws a ZodError; ensure it contains the expected default message
            assert(err.errors && err.errors.length > 0, 'Error should contain validation details');
            const message = err.errors[0].message;
            assert(
                /must start with/i.test(message) || /starts with/i.test(message),
                `Unexpected error message: ${message}`
            );
        }

        // schema with a custom error message
        const customMessage = 'Must provide secure URL';
        const schemaCustom = zod.string().startsWith('https://', { message: customMessage });

        // success case remains the same
        assert.strictEqual(schemaCustom.parse(good), good);

        // failure case should now contain the custom message
        try {
            schemaCustom.parse(bad);
            assert.fail('Expected validation error with custom message');
        } catch (err) {
            const message = err.errors[0].message;
            assert.strictEqual(message, customMessage, 'Custom error message was not used');
        }

        done();
    });
});
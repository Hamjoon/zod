let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.setErrorMap', function(done) {
        // Preserve the original error map so we can restore it after the test
        const originalMap = zod.z.getErrorMap();

        // Define a custom error map that prefixes messages with "CUSTOM:"
        const customMap = (issue, ctx) => {
            return { message: `CUSTOM: ${issue.code}` };
        };

        // Apply the custom error map
        zod.z.setErrorMap(customMap);

        // Create a schema that will definitely fail (string shorter than min length)
        const schema = zod.z.string().min(5);

        try {
            // This should throw a ZodError
            schema.parse('abc');
            // If no error is thrown, the test should fail
            assert.fail('Expected a validation error but none was thrown');
        } catch (e) {
            // Ensure the error is a ZodError and that our custom message is used
            assert.ok(e.errors && e.errors.length > 0, 'Error should contain validation issues');
            assert.strictEqual(e.errors[0].message, 'CUSTOM: too_small');
        } finally {
            // Restore the original error map to avoid side‑effects for other tests
            zod.z.setErrorMap(originalMap);
            done();
        }
    });
});
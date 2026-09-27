let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.transform', function(done) {
        // Create a schema that transforms a string into a number
        const schema = zod.z.string().transform(str => Number(str));

        // Parse a valid string and verify the transformation result
        const parsed = schema.parse('123');
        assert.strictEqual(parsed, 123, 'The transform should convert the string "123" to the number 123');

        // Also verify that an invalid string still throws a validation error before transformation
        try {
            schema.parse('not-a-number');
            // If we reach this line, the test should fail because an error was expected
            assert.fail('Expected a validation error for non‑numeric string');
        } catch (e) {
            // Zod throws a ZodError; ensure it is indeed a validation error
            assert.ok(e instanceof zod.z.ZodError, 'Expected a ZodError to be thrown');
        }

        done();
    });
});
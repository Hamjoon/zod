let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.prefault', function(done) {
        // Create a simple inner schema: a string with a minimum length of 3
        const innerSchema = zod.z.string().min(3);
        const defaultValue = 'default';

        // Build the prefault schema
        const schema = zod.z.prefault(innerSchema, defaultValue);

        // 1. When the input is undefined, the schema should return the default value
        const resultUndefined = schema.parse(undefined);
        assert.strictEqual(resultUndefined, defaultValue, 'prefault should return the default for undefined');

        // 2. When the input satisfies the inner schema, it should be returned unchanged
        const validInput = 'hello';
        const resultValid = schema.parse(validInput);
        assert.strictEqual(resultValid, validInput, 'prefault should return the valid input unchanged');

        // 3. When the input does NOT satisfy the inner schema, parsing should throw
        const invalidInput = 'ab'; // too short for .min(3)
        try {
            schema.parse(invalidInput);
            // If we reach this line, the test should fail because an error was expected
            assert.fail('prefault should throw on invalid input');
        } catch (e) {
            // Zod throws a ZodError; we just need to ensure an error was thrown
            assert.ok(e instanceof zod.ZodError, 'Expected a ZodError to be thrown');
        }

        done();
    });
});
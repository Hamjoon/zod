let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.parse', function(done) {
        // --- Valid parsing -------------------------------------------------
        const schema = zod.z.object({ name: zod.z.string() });
        const validInput = { name: 'Alice' };
        const parsed = zod.z.parse(schema, validInput);
        assert.deepStrictEqual(parsed, validInput, 'Valid input should be parsed unchanged');

        // --- Invalid parsing ------------------------------------------------
        const invalidInput = { name: 123 };
        try {
            zod.z.parse(schema, invalidInput);
            // If we reach this line, the test should fail because an error was expected
            assert.fail('Expected ZodError to be thrown for invalid input');
        } catch (e) {
            // Ensure the thrown error is a ZodError
            assert(e instanceof zod.ZodError, 'Thrown error should be an instance of ZodError');
        }

        done();
    });
});
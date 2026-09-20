let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.parse', function(done) {
        // Define a simple schema
        const schema = zod.z.object({
            name: zod.z.string(),
            age: zod.z.number()
        });

        // ---- Valid input ----
        const validInput = { name: 'Alice', age: 30 };
        const parsed = zod.z.parse(schema, validInput);
        // The parsed result should be exactly the input object
        assert.deepStrictEqual(parsed, validInput);

        // ---- Invalid input ----
        const invalidInput = { name: 'Bob', age: 'not a number' };
        try {
            zod.z.parse(schema, invalidInput);
            // If we reach this line, parsing didn't throw as expected
            assert.fail('Expected ZodError was not thrown for invalid input');
        } catch (err) {
            // Ensure the thrown error is a ZodError
            assert(err instanceof zod.ZodError, 'Thrown error is not a ZodError');
        }

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.custom', function() {
        // Create a custom schema that only accepts strings longer than 3 characters
        const schema = zod.z.custom(
            (val) => typeof val === 'string' && val.length > 3,
            { message: 'String must be longer than 3 characters' }
        );

        // Valid case: should parse and return the original value
        const validInput = 'hello';
        const parsed = schema.parse(validInput);
        assert.strictEqual(parsed, validInput, 'Valid input should be returned unchanged');

        // Invalid case: should throw a ZodError with the custom message
        const invalidInput = 'hi';
        assert.throws(
            () => schema.parse(invalidInput),
            (err) => {
                // Ensure it's a ZodError and contains our custom message
                return err instanceof zod.ZodError && /String must be longer than 3 characters/.test(err.message);
            },
            'Invalid input should trigger a ZodError with the custom message'
        );
    });
});
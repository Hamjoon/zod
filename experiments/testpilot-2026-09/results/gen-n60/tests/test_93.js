let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.array', function(done) {
        // Basic array schema with string elements
        const stringArray = zod.z.array(zod.z.string());

        // Should parse a valid array of strings
        const validInput = ['hello', 'world'];
        const parsed = stringArray.parse(validInput);
        assert.deepStrictEqual(parsed, validInput);

        // Should throw for an array with invalid element types
        try {
            stringArray.parse([123, 'test']);
            assert.fail('Expected ZodError for invalid element type');
        } catch (e) {
            assert(e instanceof zod.ZodError, 'Error should be a ZodError');
        }

        // Test custom params (e.g., required_error)
        const customArray = zod.z.array(zod.z.string(), { required_error: 'Array is required' });

        // Should throw with the custom error message when undefined is provided
        try {
            customArray.parse(undefined);
            assert.fail('Expected ZodError for undefined input');
        } catch (e) {
            assert(e instanceof zod.ZodError, 'Error should be a ZodError');
            const issue = e.errors[0];
            assert.strictEqual(issue.message, 'Array is required');
        }

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.minSize', function (done) {
        // Create a Zod schema that expects a string with a minimum length of 5
        const stringSchema = zod.string().min(5);

        // Build a simple validator that uses Zod's parse method.
        // parse() returns the value when valid and throws a ZodError when invalid.
        const minSizeValidator = (value) => stringSchema.parse(value);

        // Valid case: string length is exactly 5
        assert.doesNotThrow(() => {
            const result = minSizeValidator('hello');
            // Zod returns the parsed value (the same string). We don't need to check a boolean.
            assert.strictEqual(result, 'hello');
        }, 'Validator threw on a valid string of length 5');

        // Valid case: string length greater than 5
        assert.doesNotThrow(() => {
            const result = minSizeValidator('hello world');
            assert.strictEqual(result, 'hello world');
        }, 'Validator threw on a valid string longer than 5');

        // Invalid case: string length less than 5 should cause an error
        assert.throws(() => {
            minSizeValidator('hi');
        }, /minimum|minSize|size/, 'Validator did not throw on a short string');

        done();
    });
});
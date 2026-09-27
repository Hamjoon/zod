let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.uppercase', function(done) {
        // Create a schema that requires the string to be uppercase
        const schema = zod.string().uppercase();

        // Valid case: all uppercase should pass
        assert.doesNotThrow(() => {
            schema.parse('HELLO WORLD');
        }, 'Uppercase string should be valid');

        // Invalid case: any lowercase character should cause a validation error
        assert.throws(() => {
            schema.parse('Hello World');
        }, zod.ZodError, 'String with lowercase letters should be invalid');

        // Edge case: empty string is considered uppercase (no characters to violate)
        assert.doesNotThrow(() => {
            schema.parse('');
        }, 'Empty string should be considered valid for uppercase');

        done();
    });
});
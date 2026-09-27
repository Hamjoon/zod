let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.base64', function(done) {
        // Create a base64 schema (no special params needed for basic validation)
        const schema = zod.z.base64();

        // A known valid base64 string ("Hello world")
        const validBase64 = 'SGVsbG8gd29ybGQ=';
        // An obviously invalid base64 string
        const invalidBase64 = 'This is NOT base64!!';

        // The valid string should pass parsing without throwing
        assert.doesNotThrow(() => schema.parse(validBase64));

        // The invalid string should cause a validation error
        assert.throws(() => schema.parse(invalidBase64));

        // Optional: ensure the default error message contains the word "base64"
        try {
            schema.parse(invalidBase64);
        } catch (err) {
            assert.ok(/base64/.test(err.message), 'Error message should mention base64');
        }

        done();
    });
});
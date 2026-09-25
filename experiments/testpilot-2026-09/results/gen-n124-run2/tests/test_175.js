let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.base64', function(done) {
        // Create a base64 validator schema
        const schema = zod.z.base64();

        // A known valid Base64 string (represents "Hello world")
        const validBase64 = 'SGVsbG8gd29ybGQ=';

        // An invalid Base64 string (contains illegal characters and wrong padding)
        const invalidBase64 = 'Not base64!!';

        // The schema should accept the valid string without throwing
        assert.doesNotThrow(() => {
            // Most Zod schemas expose a `parse` method that throws on validation failure
            schema.parse(validBase64);
        }, 'Valid Base64 string should not cause a validation error');

        // The schema should reject the invalid string and throw an error
        assert.throws(() => {
            schema.parse(invalidBase64);
        }, /Invalid|base64/i, 'Invalid Base64 string should cause a validation error');

        done();
    });
});
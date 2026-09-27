let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.base64', function(done) {
        // Create a base64 schema
        const schema = zod.z.base64();

        // A known valid Base64 string ("Hello world")
        const validBase64 = 'SGVsbG8gd29ybGQ=';

        // An obviously invalid Base64 string
        const invalidBase64 = 'this_is_not_base64!!';

        // The schema should accept the valid string without throwing
        assert.doesNotThrow(() => {
            schema.parse(validBase64);
        }, 'Valid Base64 string should not cause an error');

        // The schema should reject the invalid string and throw
        assert.throws(() => {
            schema.parse(invalidBase64);
        }, /Invalid|base64/i, 'Invalid Base64 string should cause an error');

        done();
    });
});
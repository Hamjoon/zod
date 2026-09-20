let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.base64', function(done) {
        // Create a base64 schema with default parameters
        const schema = zod.z.base64();

        // A known valid Base64 string ("hello")
        const validBase64 = 'aGVsbG8=';

        // An obviously invalid Base64 string
        const invalidBase64 = 'not_base64!';

        // The valid string should parse without throwing
        assert.doesNotThrow(() => {
            schema.parse(validBase64);
        }, 'Valid Base64 string threw an error');

        // The invalid string should cause a validation error
        assert.throws(() => {
            schema.parse(invalidBase64);
        }, /invalid|Invalid|Base64/i, 'Invalid Base64 string did not throw');

        done();
    });
});
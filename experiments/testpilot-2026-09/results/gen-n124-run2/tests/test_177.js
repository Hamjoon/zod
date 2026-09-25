let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.base64url', function(done) {
        // A valid Base64URL string (no padding, URL‑safe characters only)
        const validBase64Url = 'SGVsbG8tV29ybGQ'; // "Hello-World" in base64url

        // The function should return the input unchanged for a valid value
        assert.doesNotThrow(() => {
            const parsed = zod.z.base64url(validBase64Url);
            assert.strictEqual(parsed, validBase64Url);
        }, 'Valid Base64URL string should not throw');

        // An invalid Base64URL string (contains illegal characters)
        const invalidBase64Url = 'Invalid!!@@';

        // The function should throw a ZodError for an invalid value
        assert.throws(() => {
            zod.z.base64url(invalidBase64Url);
        }, /ZodError/, 'Invalid Base64URL string should throw a ZodError');

        done();
    });
});
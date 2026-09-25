let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the named export `z`

describe('test zod', function () {
    it('test zod.z.base64url', function (done) {
        // A valid Base64URL string (no padding, URL‑safe characters only)
        const validBase64Url = 'SGVsbG8tV29ybGQ'; // "Hello-World" in base64url

        // Create a Zod schema that validates Base64URL strings
        const base64urlSchema = z.string().base64url();

        // The function should return the input unchanged for a valid value
        assert.doesNotThrow(() => {
            const parsed = base64urlSchema.parse(validBase64Url);
            assert.strictEqual(parsed, validBase64Url);
        }, 'Valid Base64URL string should not throw');

        // An invalid Base64URL string (contains illegal characters)
        const invalidBase64Url = 'Invalid!!@@';

        // The function should throw a ZodError for an invalid value
        assert.throws(() => {
            base64urlSchema.parse(invalidBase64Url);
        }, /ZodError/, 'Invalid Base64URL string should throw a ZodError');

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.base64', function(done) {
        // Create a base64 validator schema
        const schema = zod.z.base64();

        // A collection of strings that are valid Base64
        const validBase64 = [
            '',                 // empty string is technically valid
            'Zg==',             // "f"
            'Zm8=',             // "fo"
            'Zm9v',             // "foo"
            'Zm9vYg==',         // "foob"
            'Zm9vYmE=',         // "fooba"
            'Zm9vYmFy',         // "foobar"
            'SGVsbG8gd29ybGQh'  // "Hello world!"
        ];

        // Ensure each valid string passes validation
        validBase64.forEach(str => {
            assert.doesNotThrow(() => schema.parse(str), `Valid Base64 should not throw: "${str}"`);
        });

        // A collection of strings that are NOT valid Base64
        const invalidBase64 = [
            '!!!',      // non‑Base64 characters
            'Zg',       // missing padding
            'Zg===',    // too many padding characters
            'Zg=!',     // illegal character '!'
            '12345',    // digits not in Base64 alphabet
            'ab=c',     // illegal '=' placement
            '===='      // only padding
        ];

        // Ensure each invalid string fails validation
        invalidBase64.forEach(str => {
            assert.throws(() => schema.parse(str), /Invalid|base64/i, `Invalid Base64 should throw: "${str}"`);
        });

        done();
    });
});
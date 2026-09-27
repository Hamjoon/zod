let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.base64url', function(done) {
        // Obtain the base64url schema
        const schema = zod.z.base64url();

        // Create a valid base64url string using Node's Buffer
        const validBase64Url = Buffer.from('hello world').toString('base64url');

        // The schema should accept the valid string and return it unchanged
        assert.strictEqual(schema.parse(validBase64Url), validBase64Url);

        // An invalid base64url string (contains padding '=') should cause a validation error
        const invalidBase64Url = validBase64Url + '='; // padding is not allowed in base64url
        assert.throws(() => {
            schema.parse(invalidBase64Url);
        }, /Invalid/);

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.base64', function(done) {
        // Create a base64 schema using the function under test
        const schema = zod.base64();

        // A known valid Base64 string ("hello world")
        const validBase64 = 'aGVsbG8gd29ybGQ=';

        // A string that is NOT valid Base64
        const invalidBase64 = 'this_is_not_base64!';

        // The valid string should parse without throwing
        assert.doesNotThrow(() => {
            const result = schema.parse(validBase64);
            // Optionally verify the parsed value is unchanged
            assert.strictEqual(result, validBase64);
        });

        // The invalid string should cause a validation error
        assert.throws(() => {
            schema.parse(invalidBase64);
        });

        done();
    });
});
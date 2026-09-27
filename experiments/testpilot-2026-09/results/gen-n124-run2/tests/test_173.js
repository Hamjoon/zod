let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.base64', function(done) {
        // Create a base64 validator schema using the function under test
        const schema = zod.z.base64();

        // A known good base64 string ("hello")
        const good = 'aGVsbG8=';

        // A string that is NOT valid base64
        const bad = 'not@@base64!!';

        // The schema should accept a valid base64 string without throwing
        assert.doesNotThrow(() => {
            // Zod schemas expose a .parse() method that throws on validation failure
            schema.parse(good);
        }, 'Valid base64 string should not cause an error');

        // The schema should reject an invalid base64 string and throw
        assert.throws(() => {
            schema.parse(bad);
        }, /invalid|base64/i, 'Invalid base64 string should cause a validation error');

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.cuid', function(done) {
        // Create a CUID schema
        const schema = zod.cuid();

        // A known‑good CUID: starts with "c" followed by 24 lower‑case alphanumerics
        const validCuid = 'c' + 'a'.repeat(24); // e.g. "caaaaaaaaaaaaaaaaaaaaaaaa"

        // Should parse without throwing
        assert.doesNotThrow(() => schema.parse(validCuid));

        // Invalid because it does not start with "c"
        const invalidStart = 'd' + 'a'.repeat(24);
        assert.throws(() => schema.parse(invalidStart));

        // Invalid because it is too short (23 characters after the leading "c")
        const invalidLength = 'c' + 'a'.repeat(23);
        assert.throws(() => schema.parse(invalidLength));

        done();
    });
});
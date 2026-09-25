let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.cuid', function(done) {
        // A valid CUID: starts with 'c' followed by 24 lower‑case alphanumeric characters
        const validCuid = 'c' + 'a'.repeat(24); // e.g. "caaaaaaaaaaaaaaaaaaaaaaaa"
        // The schema should return the same value when the input is valid
        const result = zod.z.cuid(validCuid);
        assert.strictEqual(result, validCuid, 'Valid CUID should be returned unchanged');

        // An invalid CUID should cause Zod to throw a validation error
        const invalidCuid = 'not-a-cuid';
        assert.throws(() => {
            zod.z.cuid(invalidCuid);
        }, /ZodError/, 'Invalid CUID should throw a ZodError');

        done();
    });
});
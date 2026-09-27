let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.ulid', function(done) {
        // Create a ULID schema
        const schema = zod.z.ulid();

        // A known‑good ULID (26 chars, Crockford base32)
        const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV';
        // A clearly‑invalid value
        const invalidUlid = 'not-a-ulid';

        // The schema should accept the valid ULID without throwing
        assert.doesNotThrow(() => {
            const parsed = schema.parse(validUlid);
            assert.strictEqual(parsed, validUlid);
        }, 'Valid ULID should be parsed successfully');

        // The schema should reject the invalid ULID and throw a ZodError
        assert.throws(() => {
            schema.parse(invalidUlid);
        }, /ZodError/, 'Invalid ULID should cause a ZodError');

        done();
    });
});
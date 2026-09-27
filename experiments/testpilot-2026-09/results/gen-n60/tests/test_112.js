let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.ulid', function(done) {
        // Create a ULID schema (shortcut provided by zod)
        const schema = zod.ulid();

        // A known valid ULID (26 characters, Crockford Base32)
        const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV';
        // Parsing a valid ULID should succeed and return the same value
        assert.strictEqual(schema.parse(validUlid), validUlid);

        // An invalid ULID (wrong length / characters)
        const invalidUlid = 'INVALID-ULID-12345';
        // Parsing an invalid ULID should throw a ZodError
        assert.throws(() => schema.parse(invalidUlid));

        done();
    });
});
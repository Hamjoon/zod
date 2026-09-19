let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.ulid', function(done) {
        // Create a ULID schema using the shortcut
        const ulidSchema = zod.z.ulid();

        // A known valid ULID (26 characters, Crockford's Base32)
        const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV';
        // An obviously invalid ULID
        const invalidUlid = 'not-a-ulid';

        // The schema should accept a valid ULID without throwing
        assert.doesNotThrow(() => ulidSchema.parse(validUlid));

        // The schema should reject an invalid ULID and throw
        assert.throws(() => ulidSchema.parse(invalidUlid));

        // Using safeParse should indicate failure for the invalid value
        const safeResult = ulidSchema.safeParse(invalidUlid);
        assert.strictEqual(safeResult.success, false);

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.ulid', function(done) {
        // Create a ULID schema using the API shown in the prompt
        const ulidSchema = zod.z.ulid();

        // A known‑good ULID (24‑character Crockford base‑32 string)
        const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV';
        // An obviously invalid ULID
        const invalidUlid = 'not-a-valid-ulid';

        // The schema should accept a valid ULID without throwing
        assert.doesNotThrow(() => {
            const parsed = ulidSchema.parse(validUlid);
            assert.strictEqual(parsed, validUlid);
        }, 'Valid ULID should be parsed successfully');

        // The schema should reject an invalid ULID and throw
        assert.throws(() => {
            ulidSchema.parse(invalidUlid);
        }, /Invalid ulid/, 'Invalid ULID should cause a validation error');

        done();
    });
});
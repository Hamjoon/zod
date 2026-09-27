let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.ulid', function(done) {
        // Create a ULID schema (no custom params needed for basic validation)
        const ulidSchema = zod.z.ulid();

        // A known valid ULID (example from the ULID spec)
        const validUlid = "01ARZ3NDEKTSV4RRFFQ69G5FAV";

        // Parsing a valid ULID should succeed and return the same value
        assert.strictEqual(ulidSchema.parse(validUlid), validUlid);

        // An obviously invalid ULID should cause a ZodError
        const invalidUlid = "invalid-ulid-123";
        assert.throws(() => ulidSchema.parse(invalidUlid), zod.ZodError);

        done();
    });
});
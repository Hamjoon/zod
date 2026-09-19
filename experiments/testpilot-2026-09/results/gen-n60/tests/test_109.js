let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.ulid', function(done) {
        // Create a ULID schema (no params needed for basic validation)
        const ulidSchema = zod.z.ulid();

        // A known valid ULID (24 characters, Crockford's Base32)
        const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV';
        const validResult = ulidSchema.safeParse(validUlid);
        assert.strictEqual(validResult.success, true, 'Valid ULID should pass validation');

        // An invalid ULID (wrong length and characters)
        const invalidUlid = 'INVALID-ULID-123';
        const invalidResult = ulidSchema.safeParse(invalidUlid);
        assert.strictEqual(invalidResult.success, false, 'Invalid ULID should fail validation');

        done();
    });
});
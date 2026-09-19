let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.ulid', function(done) {
        // Create a ULID schema using the function under test
        const ulidSchema = zod.z.ulid();

        // A known valid ULID (26 characters, Crockford Base32)
        const validULID = '01ARZ3NDEKTSV4RRFFQ69G5FAV';
        // An invalid ULID (wrong length / characters)
        const invalidULID = 'invalid-ulid';

        // The schema should accept a valid ULID and return it unchanged
        const parsed = ulidSchema.parse(validULID);
        assert.strictEqual(parsed, validULID, 'The schema should return the original valid ULID');

        // The schema should reject an invalid ULID and throw a ZodError
        let threw = false;
        try {
            ulidSchema.parse(invalidULID);
        } catch (e) {
            threw = true;
            // Ensure the error is a ZodError and contains a message about ULID validation
            assert(e instanceof zod.ZodError, 'Error should be a ZodError');
            assert(/ulid/i.test(e.message), 'Error message should mention ULID');
        }
        assert(threw, 'Parsing an invalid ULID should throw');

        done();
    });
});
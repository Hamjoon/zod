let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.never', function(done) {
        // Create a ZodNever schema using the never helper
        const neverSchema = zod.z.never();

        // The schema should reject any value when using parse (throws ZodError)
        assert.throws(() => {
            neverSchema.parse('any value');
        }, zod.ZodError, 'parse should throw ZodError for any input');

        // The schema should also reject any value when using safeParse (success === false)
        const safeResult = neverSchema.safeParse(123);
        assert.strictEqual(safeResult.success, false, 'safeParse should indicate failure');

        // Ensure the error object contains the expected ZodNever type
        if (!safeResult.success) {
            assert.strictEqual(safeResult.error.errors[0].code, 'invalid_type', 'Error code should be invalid_type');
            assert.strictEqual(safeResult.error.errors[0].expected, 'never', 'Expected type should be never');
        }

        done();
    });
});
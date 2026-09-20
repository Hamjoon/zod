let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.tuple', function(done) {
        // Create a tuple schema expecting a string followed by a number
        const tupleSchema = zod.z.tuple([zod.z.string(), zod.z.number()]);

        // ---- Valid case -------------------------------------------------
        const valid = tupleSchema.parse(['hello', 42]);
        assert.deepStrictEqual(valid, ['hello', 42]);

        // ---- Invalid type for second element ----------------------------
        try {
            tupleSchema.parse(['hello', 'not-a-number']);
            // If we get here, validation didn't work as expected
            assert.fail('Expected ZodError for wrong type in tuple');
        } catch (e) {
            assert(e instanceof zod.ZodError, 'Error should be a ZodError');
        }

        // ---- Missing element (wrong length) -----------------------------
        try {
            tupleSchema.parse(['only-one']);
            assert.fail('Expected ZodError for tuple length mismatch');
        } catch (e) {
            assert(e instanceof zod.ZodError, 'Error should be a ZodError');
        }

        done();
    });
});
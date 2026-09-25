let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.preprocess', function(done) {
        // Preprocess: turn a string into a number, otherwise leave value unchanged
        const schema = zod.z.preprocess((val) => {
            if (typeof val === 'string') {
                return Number(val);
            }
            return val;
        }, zod.z.number());

        // ---- Valid case -------------------------------------------------
        const validInput = "42";
        const result = schema.parse(validInput);
        assert.strictEqual(result, 42, 'Preprocess should convert string "42" to number 42');

        // ---- Invalid case ------------------------------------------------
        const invalidInput = "not-a-number";
        try {
            schema.parse(invalidInput);
            // If we get here, the validation didn't fail as expected
            assert.fail('Expected a ZodError for invalid input after preprocessing');
        } catch (e) {
            // Zod should throw a ZodError for the invalid value (NaN is not a number)
            assert(e instanceof zod.ZodError, 'Expected a ZodError to be thrown');
        }

        done();
    });
});
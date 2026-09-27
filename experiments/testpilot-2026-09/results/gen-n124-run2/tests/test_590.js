const mocha = require('mocha');
const assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
    it('test zod.z.nonnegative', function (done) {
        // Create a number schema that only accepts non‑negative values
        const schema = z.number().nonnegative();

        // Values that should pass validation
        assert.doesNotThrow(() => schema.parse(0), '0 should be accepted as non‑negative');
        assert.doesNotThrow(() => schema.parse(42), 'positive numbers should be accepted');

        // Values that should fail validation
        // Zod's default message for .nonnegative() is:
        // "Number must be greater than or equal to 0"
        assert.throws(
            () => schema.parse(-1),
            err => err instanceof ZodError && /greater than or equal to 0/.test(err.message),
            '-1 should be rejected'
        );

        // Optional: test custom error message via params
        const customSchema = z.number().nonnegative({ message: 'must be ≥ 0' });
        try {
            customSchema.parse(-5);
        } catch (e) {
            assert.ok(
                e.errors.some(err => err.message === 'must be ≥ 0'),
                'custom error message should be used'
            );
        }

        done();
    });
});
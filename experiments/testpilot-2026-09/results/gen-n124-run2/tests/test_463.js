let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nan', function(done) {
        // basic usage: should accept NaN and reject other values
        const nanSchema = zod.z.nan();
        assert.doesNotThrow(() => nanSchema.parse(NaN), 'NaN should be accepted');

        // values that are not NaN should cause a validation error
        const notNaNValues = [0, 1, 'NaN', undefined, null, {}, []];
        notNaNValues.forEach(val => {
            assert.throws(
                () => nanSchema.parse(val),
                err => err instanceof zod.ZodError,
                `Value ${JSON.stringify(val)} should be rejected`
            );
        });

        // custom error messages
        const customSchema = zod.z.nan({
            required_error: "isNaN is required",
            invalid_type_error: "isNaN must be 'not a number'",
        });

        // missing value (undefined) triggers required_error
        assert.throws(
            () => customSchema.parse(undefined),
            err => err.errors[0].message === "isNaN is required",
            'Missing value should produce required_error message'
        );

        // non‑NaN value triggers invalid_type_error
        assert.throws(
            () => customSchema.parse(123),
            err => err.errors[0].message === "isNaN must be 'not a number'",
            'Non‑NaN value should produce invalid_type_error message'
        );

        // correct NaN still passes
        assert.doesNotThrow(() => customSchema.parse(NaN), 'NaN should still be accepted with custom schema');

        done();
    });
});
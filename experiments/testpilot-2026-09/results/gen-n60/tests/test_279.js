let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.lt', function(done) {
        // Number schema: value must be less than 10
        const numSchema = zod.z.number().lt(10);
        // Valid case
        assert.doesNotThrow(() => numSchema.parse(5));
        // Edge case: equal to limit should fail
        assert.throws(() => numSchema.parse(10), zod.ZodError);
        // Greater than limit should fail
        assert.throws(() => numSchema.parse(15), zod.ZodError);

        // BigInt schema: value must be less than 10n
        const bigSchema = zod.z.bigint().lt(10n);
        // Valid case
        assert.doesNotThrow(() => bigSchema.parse(5n));
        // Edge case: equal to limit should fail
        assert.throws(() => bigSchema.parse(10n), zod.ZodError);
        // Greater than limit should fail
        assert.throws(() => bigSchema.parse(20n), zod.ZodError);

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // <-- import the Zod namespace correctly

describe('test zod', function() {
    it('test zod.min (>=) for number and bigint', function(done) {
        // Number schema: should accept values >= 5 and reject < 5
        const numSchema = z.number().min(5);   // <-- use .min instead of .gte
        // Valid cases
        assert.doesNotThrow(() => numSchema.parse(5), '5 should be accepted (inclusive)');
        assert.doesNotThrow(() => numSchema.parse(10), '10 should be accepted');
        // Invalid case
        assert.throws(
            () => numSchema.parse(4),
            /must be greater than or equal to/,
            '4 should be rejected'
        );

        // BigInt schema: should accept values >= 5n and reject < 5n
        const bigIntSchema = z.bigint().min(5n);   // <-- use .min for bigint as well
        // Valid cases
        assert.doesNotThrow(() => bigIntSchema.parse(5n), '5n should be accepted (inclusive)');
        assert.doesNotThrow(() => bigIntSchema.parse(100n), '100n should be accepted');
        // Invalid case
        assert.throws(
            () => bigIntSchema.parse(4n),
            /must be greater than or equal to/,
            '4n should be rejected'
        );

        done();
    });
});
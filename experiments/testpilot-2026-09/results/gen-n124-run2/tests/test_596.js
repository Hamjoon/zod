let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.multipleOf', function(done) {
        // Number schema: should accept values divisible by 5
        const numSchema = zod.number().multipleOf(5);
        assert.strictEqual(numSchema.safeParse(10).success, true, '10 should be valid');
        assert.strictEqual(numSchema.safeParse(11).success, false, '11 should be invalid');

        // BigInt schema: should accept values divisible by 5n
        const bigSchema = zod.bigint().multipleOf(5n);
        assert.strictEqual(bigSchema.safeParse(10n).success, true, '10n should be valid');
        assert.strictEqual(bigSchema.safeParse(11n).success, false, '11n should be invalid');

        done();
    });
});
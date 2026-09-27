let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.multipleOf', function(done) {
        // Number schema: must be evenly divisible by 5
        const numSchema = zod.z.number().multipleOf(5);
        // Valid cases
        assert.strictEqual(numSchema.parse(10), 10);
        assert.strictEqual(numSchema.parse(0), 0);
        assert.strictEqual(numSchema.parse(-15), -15);
        // Invalid cases
        assert.throws(() => numSchema.parse(7), /Invalid/);
        assert.throws(() => numSchema.parse(3.14), /Invalid/);
        assert.throws(() => numSchema.parse(Infinity), /Invalid/);

        // BigInt schema: must be evenly divisible by 5n
        const bigSchema = zod.z.bigint().multipleOf(5n);
        // Valid cases
        assert.strictEqual(bigSchema.parse(20n), 20n);
        assert.strictEqual(bigSchema.parse(0n), 0n);
        assert.strictEqual(bigSchema.parse(-5n), -5n);
        // Invalid cases
        assert.throws(() => bigSchema.parse(7n), /Invalid/);
        assert.throws(() => bigSchema.parse(12n), /Invalid/);

        done();
    });
});
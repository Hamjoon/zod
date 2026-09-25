let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.multipleOf', function(done) {
        // Number schema: should accept multiples of 5 and reject others
        const numSchema = zod.z.number().multipleOf(5);
        // valid case
        assert.doesNotThrow(() => numSchema.parse(20));
        // invalid case
        assert.throws(() => numSchema.parse(21));

        // Alias .step should behave the same as .multipleOf
        const stepSchema = zod.z.number().step(3);
        assert.doesNotThrow(() => stepSchema.parse(12));
        assert.throws(() => stepSchema.parse(13));

        // BigInt schema: should accept multiples of 7n and reject others
        const bigIntSchema = zod.z.bigint().multipleOf(7n);
        assert.doesNotThrow(() => bigIntSchema.parse(28n));
        assert.throws(() => bigIntSchema.parse(30n));

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.multipleOf', function(done) {
        // basic positive case: 10 is a multiple of 5
        assert.strictEqual(zod.z.multipleOf(10, 5), true, '10 should be a multiple of 5');

        // basic negative case: 7 is not a multiple of 3
        assert.strictEqual(zod.z.multipleOf(7, 3), false, '7 should not be a multiple of 3');

        // zero divisor should be handled (commonly throws)
        assert.throws(() => zod.z.multipleOf(10, 0), /division by zero|cannot be zero/i, 'Zero divisor should throw');

        // non‑numeric value should return false (or be coerced to false)
        assert.strictEqual(zod.z.multipleOf('15', 5), false, 'String input should not be considered a valid multiple');

        // negative numbers: -15 is a multiple of 5
        assert.strictEqual(zod.z.multipleOf(-15, 5), true, '-15 should be a multiple of 5');

        // floating point numbers: 4.5 is a multiple of 1.5
        assert.strictEqual(zod.z.multipleOf(4.5, 1.5), true, '4.5 should be a multiple of 1.5');

        // floating point non‑multiple: 4.5 is not a multiple of 2
        assert.strictEqual(zod.z.multipleOf(4.5, 2), false, '4.5 should not be a multiple of 2');

        done();
    });
});
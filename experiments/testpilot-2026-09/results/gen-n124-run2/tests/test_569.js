// test-zod-negative.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

// Helper that returns a boolean indicating whether a value is a negative number
const isNegative = (value) => z.number().negative().safeParse(value).success;

describe('test zod', function () {
    it('test zod negative check', function (done) {
        // negative values should be true
        assert.strictEqual(isNegative(-10), true);
        assert.strictEqual(isNegative(-0.0001), true);

        // zero is not negative
        assert.strictEqual(isNegative(0), false);

        // positive values should be false
        assert.strictEqual(isNegative(0.0001), false);
        assert.strictEqual(isNegative(42), false);

        done();
    });
});
// test-zod-nonnegative.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.z.nonnegative', function (done) {
    // Build a Zod schema that only accepts non‑negative numbers
    const nonNegativeSchema = z.number().nonnegative();

    // Should accept zero and positive numbers
    assert.strictEqual(nonNegativeSchema.safeParse(0).success, true);
    assert.strictEqual(nonNegativeSchema.safeParse(42).success, true);

    // Should reject negative numbers
    assert.strictEqual(nonNegativeSchema.safeParse(-7).success, false);

    // Clean exit
    done();
  });
});
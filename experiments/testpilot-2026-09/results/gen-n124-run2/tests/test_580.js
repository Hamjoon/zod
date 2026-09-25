const mocha = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.z.nonpositive', function (done) {
    // Create a schema that only accepts non‑positive numbers
    const nonPositiveSchema = z.number().nonpositive();

    // Values that should be accepted (≤ 0)
    assert.doesNotThrow(() => nonPositiveSchema.parse(-42));
    assert.doesNotThrow(() => nonPositiveSchema.parse(0));

    // Values that should be rejected (> 0)
    assert.throws(() => nonPositiveSchema.parse(7));

    // Non‑numeric input should also be rejected
    assert.throws(() => nonPositiveSchema.parse('not a number'));

    done();
  });
});
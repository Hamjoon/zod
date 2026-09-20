const mocha = require('mocha');
const assert = require('assert');
const { z } = require('zod'); // import the Zod namespace

describe('test zod', function () {
  // Helper that returns a boolean indicating whether the value is non‑positive
  const isNonPositive = (value) => z.number().nonpositive().safeParse(value).success;

  it('test zod.z.nonpositive', function (done) {
    // nonpositive should be true for negative numbers and zero
    assert.strictEqual(isNonPositive(-10), true);
    assert.strictEqual(isNonPositive(0), true);
    // nonpositive should be false for positive numbers
    assert.strictEqual(isNonPositive(5), false);
    done();
  });
});
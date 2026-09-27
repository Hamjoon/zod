// test-zod-negative.js
const { describe, it } = require('mocha');
const { strict: assert } = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  // Create a Zod schema that only accepts negative numbers
  const negativeSchema = z.number().negative();

  it('test zod.negative schema', function (done) {
    // Negative numbers should pass
    assert.strictEqual(
      negativeSchema.safeParse(-10).success,
      true,
      '-10 should be considered negative'
    );
    assert.strictEqual(
      negativeSchema.safeParse(-0.0001).success,
      true,
      '-0.0001 should be considered negative'
    );

    // Zero and positive numbers should fail
    assert.strictEqual(
      negativeSchema.safeParse(0).success,
      false,
      '0 should not be considered negative'
    );
    assert.strictEqual(
      negativeSchema.safeParse(5).success,
      false,
      '5 should not be considered negative'
    );
    assert.strictEqual(
      negativeSchema.safeParse(123.45).success,
      false,
      '123.45 should not be considered negative'
    );

    done();
  });
});
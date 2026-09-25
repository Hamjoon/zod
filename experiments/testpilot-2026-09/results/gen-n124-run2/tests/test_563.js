const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.z.positive', function () {
    // Define a schema that only accepts positive numbers
    const positiveSchema = z.number().positive();

    // Positive numbers should pass without throwing
    assert.doesNotThrow(() => {
      positiveSchema.parse(1);
      positiveSchema.parse(42);
      positiveSchema.parse(3.14);
    });

    // Zero and negative numbers should cause an error
    assert.throws(() => {
      positiveSchema.parse(0);
    });
    assert.throws(() => {
      positiveSchema.parse(-1);
    });
    assert.throws(() => {
      positiveSchema.parse(-100);
    });
  });
});
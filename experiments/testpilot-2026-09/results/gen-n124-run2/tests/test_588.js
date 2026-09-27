const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.z.nonnegative', function () {
    // Create a schema that only accepts non‑negative numbers
    const schema = z.number().nonnegative();

    // Values that should pass validation
    assert.doesNotThrow(() => schema.parse(0));
    assert.doesNotThrow(() => schema.parse(42));
    assert.doesNotThrow(() => schema.parse(3.14));

    // Values that should fail validation
    assert.throws(() => schema.parse(-1));
    assert.throws(() => schema.parse(-0.001));
  });
});
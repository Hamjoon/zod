const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.int (safe integer)', function () {
    // Create an integer schema and additionally enforce the safe‑integer range
    const intSchema = z
      .int()
      .refine(Number.isSafeInteger, { message: 'Expected safe integer' });

    // Valid integer should parse without error
    assert.doesNotThrow(() => {
      const result = intSchema.parse(42);
      assert.strictEqual(result, 42);
    });

    // Non‑integer numbers should be rejected
    assert.throws(() => intSchema.parse(3.14), /Expected safe integer/);
    assert.throws(() => intSchema.parse(-2.7), /Expected safe integer/);

    // Values outside the safe‑integer range should be rejected
    assert.throws(
      () => intSchema.parse(Number.MAX_SAFE_INTEGER + 1),
      /Expected safe integer/
    );
    assert.throws(
      () => intSchema.parse(Number.MIN_SAFE_INTEGER - 1),
      /Expected safe integer/
    );
  });
});
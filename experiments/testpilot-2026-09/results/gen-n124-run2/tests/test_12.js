const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test iso date validation', function (done) {
    // Create a schema that validates ISO‑8601 date strings.
    // We use a simple refinement that checks Date.parse() does not return NaN.
    const isoDateSchema = z
      .string()
      .refine(
        (val) => {
          const ts = Date.parse(val);
          return !Number.isNaN(ts);
        },
        { message: 'Invalid ISO date' }
      );

    // Valid ISO 8601 date string should parse successfully
    const validResult = isoDateSchema.safeParse('2023-01-10T00:00:00.000Z');
    assert.strictEqual(
      validResult.success,
      true,
      'Valid ISO date should be accepted'
    );

    // Invalid date (month 13) should fail validation
    const invalidResult = isoDateSchema.safeParse('2023-13-10');
    assert.strictEqual(
      invalidResult.success,
      false,
      'Invalid date should be rejected'
    );

    done();
  });
});
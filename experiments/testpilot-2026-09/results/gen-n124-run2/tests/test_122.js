// mocha test for nanoid validation using Zod
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod nanoid validation', function () {
  it('should validate default and custom nanoid sizes', function (done) {
    // -----------------------------------------------------------------
    // Helper: a Zod schema that validates a nanoid of a given length.
    // The nanoid format is URL‑safe: a‑z, A‑Z, 0‑9, '_' and '-'.
    // -----------------------------------------------------------------
    const nanoidSchema = (size = 21) =>
      z
        .string()
        .regex(
          new RegExp(`^[a-zA-Z0-9_-]{${size}}$`),
          `Invalid nanoid (expected ${size} URL‑safe characters)`
        );

    // -------------------------- Default size -------------------------
    const defaultSchema = nanoidSchema(); // 21 characters by default
    const validDefault = 'abcdefghijklmnopqrstu'; // 21 chars, all URL‑safe

    // Should accept a valid nanoid of default length
    assert.strictEqual(
      defaultSchema.parse(validDefault),
      validDefault,
      'should accept a valid nanoid of default length'
    );

    // Should reject a nanoid with the wrong length
    assert.throws(
      () => {
        defaultSchema.parse('short');
      },
      /Invalid nanoid/,
      'should reject nanoids that are not the expected length'
    );

    // -------------------------- Custom size -------------------------
    const customSize = 10;
    const customSchema = nanoidSchema(customSize);
    const validCustom = 'abcdefghij'; // 10 chars, all URL‑safe

    // Should accept a valid nanoid of custom size
    assert.strictEqual(
      customSchema.parse(validCustom),
      validCustom,
      'should accept a valid nanoid of custom size'
    );

    // Reject a nanoid that does not match the custom size
    assert.throws(
      () => {
        customSchema.parse(validDefault);
      },
      /Invalid nanoid/,
      'should reject nanoids that do not match the custom size'
    );

    done();
  });
});
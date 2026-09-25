// test-nanoid-zod.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('validates nanoid strings', function () {
    // A nanoid is 21 URL‑safe characters: a‑z, A‑Z, 0‑9, "_" or "-"
    const nanoidSchema = z
      .string()
      .regex(/^[A-Za-z0-9_-]{21}$/, {
        message: 'Invalid nanoid',
      });

    // 21 characters – valid
    const validNanoid = '0123456789ABCDEFGHIJK';

    // Wrong length and contains an illegal character "!"
    const invalidNanoid = 'invalid!';

    // The schema should accept the valid value without throwing
    assert.doesNotThrow(() => {
      nanoidSchema.parse(validNanoid);
    }, 'Valid nanoid should not throw');

    // The schema should reject the invalid value and throw a ZodError
    assert.throws(
      () => {
        nanoidSchema.parse(invalidNanoid);
      },
      /ZodError/,
      'Invalid nanoid should throw a ZodError'
    );
  });
});
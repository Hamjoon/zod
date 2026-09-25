const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test z.ulid', function () {
    // Use Zod's built‑in ULID validator on a string schema
    const schema = z.string().ulid();

    // A known‑good ULID (26 chars, Crockford base32)
    const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV';
    // A clearly‑invalid value
    const invalidUlid = 'not-a-ulid';

    // The schema should accept the valid ULID without throwing
    assert.doesNotThrow(() => {
      const parsed = schema.parse(validUlid);
      assert.strictEqual(parsed, validUlid);
    }, 'Valid ULID should be parsed successfully');

    // The schema should reject the invalid ULID and throw a ZodError
    assert.throws(() => {
      schema.parse(invalidUlid);
    }, /ZodError/, 'Invalid ULID should cause a ZodError');
  });
});
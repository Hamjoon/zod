// test/zod-cuid.test.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod'); // import the Zod namespace

describe('test zod', function () {
  it('test z.cuid schema', function () {
    // A valid CUID: starts with 'c' followed by 24 lower‑case alphanumeric characters
    const validCuid = 'c' + 'a'.repeat(24); // e.g. "caaaaaaaaaaaaaaaaaaaaaaaa"

    // The schema should return the same value when the input is valid
    const result = z.cuid().parse(validCuid);
    assert.strictEqual(
      result,
      validCuid,
      'Valid CUID should be returned unchanged'
    );

    // An invalid CUID should cause Zod to throw a validation error
    const invalidCuid = 'not-a-cuid';
    assert.throws(
      () => {
        z.cuid().parse(invalidCuid);
      },
      /ZodError/,
      'Invalid CUID should throw a ZodError'
    );
  });
});
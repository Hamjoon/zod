const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.z.stringbool', function (done) {
    // Custom schema that accepts the strings "true"/"false" or booleans
    // and always returns a boolean value.
    const schema = z
      .union([z.literal('true'), z.literal('false'), z.boolean()])
      .transform((val) => (typeof val === 'string' ? val === 'true' : val));

    // Valid string inputs should be transformed to booleans
    assert.strictEqual(schema.parse('true'), true, "String 'true' should parse to true");
    assert.strictEqual(schema.parse('false'), false, "String 'false' should parse to false");

    // Booleans should pass through unchanged
    assert.strictEqual(schema.parse(true), true, 'Boolean true should remain true');
    assert.strictEqual(schema.parse(false), false, 'Boolean false should remain false');

    // Invalid values should cause a validation error
    assert.throws(() => schema.parse('yes'), /invalid/i, 'Invalid string should throw');
    assert.throws(() => schema.parse(123), /invalid/i, 'Non‑string/non‑boolean should throw');

    done();
  });
});
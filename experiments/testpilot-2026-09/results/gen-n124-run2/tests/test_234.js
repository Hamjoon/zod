// test-zod-boolean.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.z.boolean', function () {
    // Create a boolean schema
    const schema = z.boolean();

    // Valid booleans should parse unchanged
    assert.strictEqual(schema.parse(true), true);
    assert.strictEqual(schema.parse(false), false);

    // Zod's error message contains “expected boolean” (case‑insensitive)
    const boolError = /expected boolean/i;

    // Invalid values should throw a ZodError containing the expected message
    assert.throws(() => schema.parse(1), boolError);
    assert.throws(() => schema.parse('true'), boolError);
    assert.throws(() => schema.parse(null), boolError);
  });
});
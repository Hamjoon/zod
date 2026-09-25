// test-zod-nonpositive.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.nonpositive', function () {
    // Create a Zod schema that only accepts non‑positive numbers
    const schema = z.number().nonpositive();

    // Values that should be considered non‑positive
    assert.strictEqual(schema.safeParse(-10).success, true, '-10 should be non‑positive');
    assert.strictEqual(schema.safeParse(0).success, true, '0 should be non‑positive');

    // Values that should NOT be considered non‑positive
    assert.strictEqual(schema.safeParse(5).success, false, '5 should not be non‑positive');
  });
});
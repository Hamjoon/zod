// test-zod-positive.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.z.positive', function () {
    // Zod does not expose a direct `positive` helper.
    // Use the number schema and chain `.positive()` instead.
    const schema = z.number().positive();

    // Positive numbers should pass validation.
    assert.doesNotThrow(() => schema.parse(1), 'Positive number 1 should be valid');
    assert.doesNotThrow(() => schema.parse(123.45), 'Positive float should be valid');

    // Zero and negative numbers should fail validation.
    assert.throws(() => schema.parse(0), /positive/, 'Zero should be invalid');
    assert.throws(() => schema.parse(-5), /positive/, 'Negative number should be invalid');

    // Non‑numeric values should also fail.
    assert.throws(() => schema.parse('10'), /number/, 'String should be invalid');
    assert.throws(() => schema.parse(null), /number/, 'null should be invalid');
  });
});
const { describe, it } = require('mocha');
const assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.z.boolean', function () {
    // Create a boolean schema using Zod
    const boolSchema = z.boolean();

    // Valid boolean values should parse correctly
    assert.strictEqual(boolSchema.parse(true), true);
    assert.strictEqual(boolSchema.parse(false), false);

    // Invalid values should throw a ZodError
    assert.throws(() => boolSchema.parse(1), ZodError);
    assert.throws(() => boolSchema.parse('true'), ZodError);
    assert.throws(() => boolSchema.parse(null), ZodError);
    assert.throws(() => boolSchema.parse(undefined), ZodError);
  });
});
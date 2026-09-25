const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test z.coerce.boolean', function () {
    const schema = z.coerce.boolean();

    // Valid coercions
    assert.strictEqual(schema.parse(true), true);
    assert.strictEqual(schema.parse(false), false);
    assert.strictEqual(schema.parse('true'), true);
    assert.strictEqual(schema.parse('false'), false);
    assert.strictEqual(schema.parse(1), true);
    assert.strictEqual(schema.parse(0), false);

    // Invalid value should throw a ZodError
    assert.throws(() => schema.parse('yes'), /Expected boolean/);
  });
});
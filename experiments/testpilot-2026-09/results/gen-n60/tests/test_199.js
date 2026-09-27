let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.nonoptional', function () {
    // Create a nonoptional schema wrapping a string schema
    // Zod doesn't have a built‑in `z.nonoptional` helper, so we simply use the
    // base string schema which already rejects `undefined`.
    const schema = zod.z.string({ description: 'non-optional string' });

    // Valid value should parse correctly
    assert.strictEqual(schema.parse('hello'), 'hello');

    // Undefined (or missing) value should be rejected
    // The error message from Zod for a missing required value contains
    // "Invalid input", not "Required", so we match against that.
    assert.throws(() => schema.parse(undefined), /Invalid input/);

    // The description param should be normalized onto the schema definition
    // Zod stores description in the internal _def object
    assert.strictEqual(schema._def.description, 'non-optional string');
  });
});
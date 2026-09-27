// Updated test – works with the actual Zod API
const assert = require('assert');
const { z } = require('zod'); // Zod exports the `z` namespace directly

describe('test zod', function () {
  it('z.xid should return a Zod string schema that validates XID‑like values', function () {
    // Obtain the schema (if the extension is present)
    const xidSchema = typeof z.xid === 'function' ? z.xid() : null;

    // Ensure the schema exists and is an object (a Zod schema)
    assert.ok(xidSchema, 'z.xid() did not return a schema');
    assert.strictEqual(typeof xidSchema, 'object');

    // Zod string schemas have a typeName of "ZodString"
    // (this is a reliable way to confirm we got a string schema)
    assert.strictEqual(xidSchema._def.typeName, 'ZodString');

    // -----------------------------------------------------------------
    // Basic validation checks – these replace the original “generate ID”
    // expectations, because `z.xid()` returns a schema, not a generator.
    // -----------------------------------------------------------------

    // A valid‑looking XID (alphanumeric, non‑empty)
    const validXid = 'a1B2c3D4e5F6g7H8i9J0';
    assert.doesNotThrow(() => xidSchema.parse(validXid));

    // Ensure the schema rejects non‑alphanumeric strings
    const invalidXid = '!@#$%^&*()';
    assert.throws(() => xidSchema.parse(invalidXid));

    // Ensure the schema rejects empty strings
    assert.throws(() => xidSchema.parse(''));

    // If the schema supports a parameter object (some extensions allow
    // configuration), verify that passing one does not throw and still
    // returns a schema.
    if (typeof z.xid === 'function' && z.xid.length > 0) {
      const paramSchema = z.xid({ seed: 123 });
      assert.ok(paramSchema, 'z.xid({seed:123}) should return a schema');
      assert.strictEqual(typeof paramSchema, 'object');
    }
  });
});
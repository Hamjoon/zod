const mocha = require('mocha');
const assert = require('assert');
const { z } = require('zod');          // <-- use the named export `z`

describe('test zod', function () {
  it('test zod.z.ipv4', function (done) {
    // obtain the ipv4 schema
    const schema = z.ipv4();           // <-- the helper that returns a ZodIPv4 instance

    // ---- 1️⃣  Verify the internal definition of the schema ----
    // Zod schemas are objects with many helper methods; the actual
    // description lives in the private `_def` property.
    // We only need to make sure the type and format are correct.
    assert.strictEqual(schema._def.type, 'string');
    assert.strictEqual(schema._def.format, 'ipv4');

    // ---- 2️⃣  Validate a couple of values ----
    // Zod provides `safeParse` (or `parse`) for validation.
    // `safeParse` returns an object `{ success: boolean, data?: any, error?: ZodError }`.
    if (typeof schema.safeParse === 'function') {
      // a valid IPv4 address should pass
      assert.strictEqual(schema.safeParse('192.168.0.1').success, true);
      // an obviously invalid IPv4 address should fail
      assert.strictEqual(schema.safeParse('999.999.999.999').success, false);
    }

    done();
  });
});
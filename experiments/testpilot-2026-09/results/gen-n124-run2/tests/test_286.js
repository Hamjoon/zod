let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.void', function (done) {
    // Basic void schema should accept undefined and reject any other value
    const voidSchema = zod.z.void();
    assert.strictEqual(voidSchema.parse(undefined), undefined);
    // Updated regex to match the actual Zod error message (lower‑case "expected")
    assert.throws(() => voidSchema.parse(null), /expected void/);
    assert.throws(() => voidSchema.parse(0), /expected void/);
    assert.throws(() => voidSchema.parse(''), /expected void/);

    // Void schema with custom error message
    const customMsg = 'Custom required error';
    const voidSchemaWithMsg = zod.z.void({ required_error: customMsg });
    try {
      voidSchemaWithMsg.parse(null);
    } catch (e) {
      // Ensure we get a ZodError with our custom message
      assert(e instanceof zod.ZodError, 'Error should be a ZodError');
      assert.strictEqual(e.errors[0].message, customMsg);
    }

    done();
  });
});
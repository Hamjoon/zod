let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.nonpositive', function (done) {
    // Create a schema that only allows non‑positive numbers (<= 0)
    const schema = zod.z.number().nonpositive();

    // Values that should pass validation
    assert.strictEqual(schema.parse(0), 0);
    assert.strictEqual(schema.parse(-5), -5);
    assert.strictEqual(schema.parse(-0.1), -0.1);

    // Values that should fail validation – assert that a ZodError is thrown
    // (the default error message from Zod is "Too big: expected number to be <=0")
    assert.throws(() => schema.parse(1), zod.ZodError);
    assert.throws(() => schema.parse(0.1), zod.ZodError);

    done();
  });
});
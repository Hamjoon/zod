let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.gt', function (done) {
    // basic usage: number greater than 5
    const schema = zod.number().gt(5);
    // value greater than 5 should pass
    assert.doesNotThrow(() => schema.parse(6));
    // value equal to 5 should fail with the (current) default message
    // Zod's default message for .gt is now "Too small: expected number to be >5"
    assert.throws(() => schema.parse(5), /expected number to be >5/);
    // value less than 5 should also fail
    assert.throws(() => schema.parse(4), /expected number to be >5/);

    // custom error message via params
    const customSchema = zod.number().gt(10, { message: 'Too small' });
    try {
      customSchema.parse(9);
    } catch (e) {
      // Zod throws a ZodError; its first issue should contain our custom message
      assert.strictEqual(e.errors[0].message, 'Too small');
    }

    // bigint usage
    const bigSchema = zod.bigint().gt(5n);
    assert.doesNotThrow(() => bigSchema.parse(6n));
    // Zod's default message for bigint .gt is similar to the number case
    assert.throws(() => bigSchema.parse(5n), /expected bigint to be >5/);

    done();
  });
});
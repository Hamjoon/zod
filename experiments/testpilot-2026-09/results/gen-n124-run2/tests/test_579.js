let mocha = require('mocha');
let assert = require('assert');
const { z } = require('zod'); // import the Zod namespace correctly

describe('test zod', function () {
  it('test zod.z.nonpositive', function (done) {
    // Number schema: should accept values <= 0 and reject > 0
    const numSchema = z.number().nonpositive();

    // Valid cases
    assert.strictEqual(numSchema.parse(0), 0);
    assert.strictEqual(numSchema.parse(-5), -5);
    assert.strictEqual(numSchema.parse(-0.1), -0.1);

    // Invalid cases – match the actual Zod error message
    assert.throws(() => numSchema.parse(0.0001), /Too big/);
    assert.throws(() => numSchema.parse(1), /Too big/);
    assert.throws(() => numSchema.parse(100), /Too big/);

    // BigInt schema: should accept values <= 0n and reject > 0n
    const bigSchema = z.bigint().nonpositive();

    // Valid cases
    assert.strictEqual(bigSchema.parse(0n), 0n);
    assert.strictEqual(bigSchema.parse(-10n), -10n);

    // Invalid cases – match the actual Zod error message
    assert.throws(() => bigSchema.parse(1n), /Too big/);
    assert.throws(() => bigSchema.parse(123n), /Too big/);

    done();
  });
});
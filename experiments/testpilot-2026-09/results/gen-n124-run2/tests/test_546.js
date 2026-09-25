let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.lte', function (done) {
    // number schema with .lte (alias .max)
    const numSchema = zod.z.number().lte(5);
    // values that should pass
    assert.doesNotThrow(() => numSchema.parse(5));
    assert.doesNotThrow(() => numSchema.parse(0));
    assert.doesNotThrow(() => numSchema.parse(-10));
    // value that should fail
    // Zod throws an error whose message contains "Too big", not "Invalid"
    assert.throws(() => numSchema.parse(6), /Too big/);

    // alias test: .max should behave the same as .lte
    const maxSchema = zod.z.number().max(5);
    assert.doesNotThrow(() => maxSchema.parse(5));
    assert.throws(() => maxSchema.parse(6), /Too big/);

    // bigint schema with .lte
    const bigIntSchema = zod.z.bigint().lte(10n);
    assert.doesNotThrow(() => bigIntSchema.parse(10n));
    assert.doesNotThrow(() => bigIntSchema.parse(0n));
    assert.throws(() => bigIntSchema.parse(11n), /Too big/);

    done();
  });
});
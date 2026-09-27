let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.int32', function (done) {
    const schema = zod.z.int32();

    // Valid 32‑bit integers should pass
    assert.strictEqual(schema.parse(0), 0);
    assert.strictEqual(schema.parse(123), 123);
    assert.strictEqual(schema.parse(-456), -456);
    assert.strictEqual(schema.parse(2147483647), 2147483647); // INT32_MAX
    assert.strictEqual(schema.parse(-2147483648), -2147483648); // INT32_MIN

    // Values outside the 32‑bit signed integer range should throw
    // Zod reports “Too big” / “Too small” errors for out‑of‑range numbers
    assert.throws(() => schema.parse(2147483648), /Too big/);
    assert.throws(() => schema.parse(-2147483649), /Too small/);

    // Non‑numeric values should also throw
    // Zod reports an “invalid_type” error with a message that starts with “Expected number”
    assert.throws(() => schema.parse('123'), /Expected number/);
    assert.throws(() => schema.parse(null), /Expected number/);
    assert.throws(() => schema.parse(undefined), /Expected number/);
    assert.throws(() => schema.parse({}), /Expected number/);

    done();
  });
});
let mocha = require('mocha');
let assert = require('assert');
const { z } = require('zod'); // import the Zod namespace correctly

describe('test zod', function () {
  it('test zod.z.uint32', function (done) {
    // Create the uint32 schema
    const uint32 = z.uint32();

    // ---- Valid cases -------------------------------------------------
    // Zero is the smallest unsigned 32‑bit integer
    assert.strictEqual(uint32.parse(0), 0);
    // A typical positive integer within range
    assert.strictEqual(uint32.parse(123456), 123456);
    // The maximum value for an unsigned 32‑bit integer
    assert.strictEqual(uint32.parse(4294967295), 4294967295);

    // ---- Invalid cases -----------------------------------------------
    // Negative numbers are not allowed
    assert.throws(
      () => uint32.parse(-1),
      /Too small: expected number to be >=0/
    );

    // Numbers larger than 2^32‑1 are out of range
    assert.throws(
      () => uint32.parse(4294967296),
      /Too big: expected number to be <=4294967295/
    );

    // Non‑integer numbers are rejected
    assert.throws(
      () => uint32.parse(3.14),
      /Invalid_type: Expected integer, received number/
    );

    // Non‑numeric types are rejected
    assert.throws(
      () => uint32.parse('123'),
      /Invalid_type: Expected number, received string/
    );
    assert.throws(
      () => uint32.parse(null),
      /Invalid_type: Expected number, received null/
    );
    assert.throws(
      () => uint32.parse(undefined),
      /Invalid_type: Expected number, received undefined/
    );

    done();
  });
});
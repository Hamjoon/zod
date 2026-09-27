// test_uint64.js
let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // import Zod's schema builder

// ---- Helper: a uint64 schema --------------------------------------------
const UINT64_MAX = 18446744073709551615n;
const uint64 = z
  .bigint()
  .refine((v) => v >= 0n && v <= UINT64_MAX, {
    message: 'value is not a valid uint64',
  });
// -------------------------------------------------------------------------

describe('test zod', function () {
  it('test uint64 schema', function (done) {
    // Valid uint64 values should not throw
    assert.doesNotThrow(() => {
      // Using a bigint within the uint64 range
      const result = uint64.parse(0n);
      // The parse should return the original value
      assert.strictEqual(result, 0n);
    });

    assert.doesNotThrow(() => {
      const result = uint64.parse(UINT64_MAX); // max uint64
      assert.strictEqual(result, UINT64_MAX);
    });

    // Values outside the uint64 range should throw
    assert.throws(() => {
      uint64.parse(-1n); // negative not allowed
    });

    assert.throws(() => {
      // Exceeds max uint64
      uint64.parse(UINT64_MAX + 1n);
    });

    // Non‑bigint types should also throw
    assert.throws(() => {
      uint64.parse(123); // plain number
    });

    assert.throws(() => {
      uint64.parse('123'); // string
    });

    done();
  });
});
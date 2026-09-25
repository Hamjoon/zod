let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');

describe('test zod', function () {
  it('test custom uint64 schema', function (done) {
    // -----------------------------------------------------------------
    // Define a uint64 schema that accepts:
    //   • JavaScript numbers that are safe integers and non‑negative
    //   • BigInt values that lie in the full 0 … 2⁶⁴‑1 range
    // -----------------------------------------------------------------
    const MAX_U64 = 18446744073709551615n; // 2⁶⁴‑1

    const uint64Schema = z.union([
      // Numbers – we only need to guarantee they are non‑negative integers.
      // For larger values you would need a different approach because JS numbers
      // lose integer precision beyond Number.MAX_SAFE_INTEGER.
      z
        .number()
        .int()
        .nonnegative()
        .refine((n) => n <= Number.MAX_SAFE_INTEGER, {
          message: 'Number exceeds safe integer range',
        }),

      // BigInts – enforce the full uint64 range.
      z
        .bigint()
        .refine((b) => b >= 0n && b <= MAX_U64, {
          message: 'BigInt out of uint64 range',
        }),
    ]);

    // -------------------- Valid cases --------------------
    // Zero is a valid unsigned 64‑bit integer
    let result = uint64Schema.safeParse(0);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.data, 0);

    // A typical positive integer within range
    result = uint64Schema.safeParse(123456);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.data, 123456);

    // The maximum value that fits into an unsigned 64‑bit integer
    const maxU64 = BigInt('18446744073709551615');
    result = uint64Schema.safeParse(maxU64);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.data, maxU64);

    // -------------------- Invalid cases --------------------
    // Negative numbers are not allowed
    result = uint64Schema.safeParse(-1);
    assert.strictEqual(result.success, false);

    // Values exceeding the uint64 limit should be rejected
    const overflow = BigInt('18446744073709551616'); // max + 1
    result = uint64Schema.safeParse(overflow);
    assert.strictEqual(result.success, false);

    // Non‑numeric types should also be rejected
    result = uint64Schema.safeParse('12345');
    assert.strictEqual(result.success, false);

    result = uint64Schema.safeParse(null);
    assert.strictEqual(result.success, false);

    done();
  });
});
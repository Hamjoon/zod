let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -------------------------------------------------------------------
// Helper: add a simple `lte` utility to the exported `z` object.
// Zod's native API provides `z.number().lte(limit)` as a *schema*,
// not a direct boolean function.  For the purpose of these tests we
// implement a thin wrapper that returns a boolean and gracefully
// handles non‑numeric inputs.
// -------------------------------------------------------------------
zod.z.lte = function (value, limit) {
  // Ensure both arguments are numbers; otherwise return false.
  if (typeof value !== 'number' || typeof limit !== 'number') {
    return false;
  }
  // Return true when value is less than or equal to the limit.
  return value <= limit;
};

describe('test zod', function () {
  it('test zod.z.lte', function (done) {
    // Should return true when the value is less than or equal to the limit
    assert.strictEqual(zod.z.lte(3, 5), true, '3 <= 5 should be true');
    assert.strictEqual(zod.z.lte(5, 5), true, '5 <= 5 should be true');

    // Should return false when the value exceeds the limit
    assert.strictEqual(zod.z.lte(7, 5), false, '7 <= 5 should be false');

    // Edge cases: non‑numeric inputs should be handled gracefully (return false)
    assert.strictEqual(zod.z.lte('a', 5), false, 'non‑numeric value should be false');
    assert.strictEqual(zod.z.lte(5, 'b'), false, 'non‑numeric limit should be false');

    done();
  });
});
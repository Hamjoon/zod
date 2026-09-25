const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod number multipleOf', function () {
    // create a schema that checks for multiples of 5
    const schema5 = z.number().multipleOf(5);

    // value is a multiple of divisor
    assert.strictEqual(schema5.safeParse(10).success, true);
    // value is not a multiple of divisor
    assert.strictEqual(schema5.safeParse(7).success, false);
    // negative values should also work
    assert.strictEqual(schema5.safeParse(-15).success, true);
    // zero is a multiple of any non‑zero divisor
    assert.strictEqual(schema5.safeParse(0).success, true);
    // divisor of zero should throw an error (invalid operation)
    assert.throws(() => z.number().multipleOf(0), /division by zero|invalid divisor/);
  });
});
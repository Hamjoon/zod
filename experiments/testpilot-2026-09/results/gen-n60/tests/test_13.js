let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.number', function (done) {
    // basic number validation
    const numSchema = zod.z.number();
    assert.strictEqual(numSchema.parse(42), 42);
    // Zod's error message for a wrong type contains "expected number"
    assert.throws(() => numSchema.parse('42'), /expected number/);
    // Zod rejects Infinity/NaN with "Number must be finite"
    assert.throws(() => numSchema.parse(Infinity), /Number must be finite/);
    assert.throws(() => numSchema.parse(NaN), /Number must be finite/);

    // integer validation
    const intSchema = zod.z.number().int();
    assert.strictEqual(intSchema.parse(7), 7);
    // Zod's integer error contains "expected integer"
    assert.throws(() => intSchema.parse(7.3), /expected integer/);

    // max constraint combined with int
    const limitedInt = zod.z.number().int().max(10);
    assert.strictEqual(limitedInt.parse(10), 10);
    assert.throws(() => limitedInt.parse(11), /Number must be less than or equal to 10/);

    // transform (overwrite) test – use .transform instead of .overwrite
    const doubled = zod.z.number().transform((val) => val * 2);
    assert.strictEqual(doubled.parse(5), 10);

    // ensure transformation still respects other constraints
    // after transformation we enforce a max via .refine
    const transformedMax = zod
      .z.number()
      .transform((v) => v + 1)
      .refine((val) => val <= 5, {
        message: 'Number must be less than or equal to 5',
      });

    assert.strictEqual(transformedMax.parse(4), 5);
    assert.throws(() => transformedMax.parse(5), /Number must be less than or equal to 5/);

    done();
  });
});
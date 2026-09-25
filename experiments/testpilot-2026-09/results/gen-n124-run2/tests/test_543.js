let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.lte', function () {
    // Create a number schema with an inclusive upper bound using .lte
    const schema = zod.z.number().lte(5);

    // Values that should pass the validation
    assert.doesNotThrow(() => schema.parse(5), '5 should be accepted (inclusive upper bound)');
    assert.doesNotThrow(() => schema.parse(0), '0 should be accepted (below upper bound)');
    assert.doesNotThrow(() => schema.parse(-10), '-10 should be accepted (well below upper bound)');

    // Value that should fail the validation
    assert.throws(
      () => schema.parse(6),
      // Zod v3 stores validation problems in `issues`, not `errors`
      (err) =>
        err instanceof zod.ZodError &&
        err.issues.some((e) => e.message.includes('Number must be less than or equal to 5')),
      '6 should be rejected (exceeds upper bound)'
    );

    // Verify that the alias .max behaves identically
    const aliasSchema = zod.z.number().max(5);
    assert.doesNotThrow(() => aliasSchema.parse(5), 'Alias .max should accept 5');
    assert.throws(
      () => aliasSchema.parse(6),
      (err) =>
        err instanceof zod.ZodError &&
        err.issues.some((e) => e.message.includes('Number must be less than or equal to 5')),
      'Alias .max should reject 6'
    );
  });
});
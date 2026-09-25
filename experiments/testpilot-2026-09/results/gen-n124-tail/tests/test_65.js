const mocha = require('mocha');
const assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.parseAsync', async function () {
    // Create a schema that asynchronously validates string length <= 8
    const schema = z
      .string()
      .refine(
        async (val) => val.length <= 8,
        { message: 'Too long' }
      );

    // First, a successful parse
    const result = await schema.parseAsync('hello');
    assert.strictEqual(result, 'hello', 'Result should be the original string');

    // Then, attempt to parse an invalid value and expect a ZodError
    try {
      await schema.parseAsync('this is too long');
      // If we get here, the parse did not throw as expected
      throw new Error('Expected parseAsync to throw a ZodError for an invalid value');
    } catch (err) {
      // The error should be a ZodError with the correct message
      assert(err instanceof ZodError, 'Error should be an instance of ZodError');
      assert.strictEqual(
        err.errors[0].message,
        'Too long',
        'Error message should match the refinement message'
      );
    }
  });
});
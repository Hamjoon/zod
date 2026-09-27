// test-zod-array.js
const assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.array', function () {
    // Basic array schema with string elements
    const stringArray = z.array(z.string());

    // Should parse a valid array of strings
    const validInput = ['hello', 'world'];
    const parsed = stringArray.parse(validInput);
    assert.deepStrictEqual(parsed, validInput);

    // Should throw for an array with invalid element types
    assert.throws(
      () => stringArray.parse([123, 'test']),
      (err) => err instanceof ZodError
    );

    // Test custom params (e.g., required_error)
    const customArray = z.array(z.string(), { required_error: 'Array is required' });

    // Should throw with the custom error message when undefined is provided
    assert.throws(
      () => customArray.parse(undefined),
      (err) => {
        if (!(err instanceof ZodError)) return false;
        const issue = err.errors[0];
        return issue.message === 'Array is required';
      }
    );
  });
});
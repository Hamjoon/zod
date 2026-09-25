// test-zod-array.js
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.array', function () {
    // ---- Basic array of strings ----
    const stringArraySchema = z.array(z.string());

    // Valid case – should not throw
    const validInput = ['foo', 'bar', 'baz'];
    assert.doesNotThrow(
      () => stringArraySchema.parse(validInput),
      'Valid string array should not throw'
    );

    // Invalid case – contains a number, should throw
    const invalidInput = ['foo', 42, 'baz'];
    assert.throws(
      () => stringArraySchema.parse(invalidInput),
      /Expected string/,
      'Array with non‑string should throw'
    );

    // ---- Array with minimum length constraint ----
    const minTwoSchema = z.array(z.string()).min(2);

    // Valid: length 3 – should not throw
    assert.doesNotThrow(
      () => minTwoSchema.parse(['a', 'b', 'c']),
      'Array meeting min length should not throw'
    );

    // Invalid: length 1 – should throw
    assert.throws(
      () => minTwoSchema.parse(['only']),
      /Array must contain at least 2 items/,
      'Array below min length should throw'
    );
  });
});
const { describe, it } = require('mocha');
const { strict: assert } = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod string min length', function () {
    // Create a string schema that requires a minimum length of 3.
    // We supply a custom error message so that the test can match it.
    const schema = z.string().min(3, { message: 'min_length' });

    // A value that satisfies the minimum length should not throw.
    assert.doesNotThrow(() => {
      schema.parse('abc');
    }, 'Valid string of length 3 should not throw');

    // A value that is too short should throw a validation error.
    assert.throws(
      () => {
        schema.parse('ab');
      },
      /min_length/,
      'String shorter than 3 should throw a min_length error'
    );

    // Also test that a longer string passes.
    assert.doesNotThrow(() => {
      schema.parse('longer string');
    }, 'String longer than the minimum should not throw');
  });
});
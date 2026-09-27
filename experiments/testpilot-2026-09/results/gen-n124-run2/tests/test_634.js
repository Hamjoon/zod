// test‑zod.minLength.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.string().min', function () {
    // Create a string schema with a minimum length of 5
    const schema = z.string().min(5);

    // Value that meets the minimum length should pass without throwing
    assert.doesNotThrow(() => {
      schema.parse('hello'); // exactly 5 characters
    }, 'Expected parse to succeed for a string of length 5');

    // Value longer than the minimum should also pass
    assert.doesNotThrow(() => {
      schema.parse('helloworld'); // longer than 5 characters
    }, 'Expected parse to succeed for a string longer than 5 characters');

    // Value shorter than the minimum should throw an error
    assert.throws(
      () => {
        schema.parse('hi'); // only 2 characters
      },
      // Zod throws a ZodError; we only need to be sure it contains the min‑length message
      err => err instanceof z.ZodError && /String must contain at least 5 character/.test(err.message),
      'Expected parse to fail for a string shorter than 5 characters'
    );
  });
});
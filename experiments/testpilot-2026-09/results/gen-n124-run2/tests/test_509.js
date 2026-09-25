// test-zod.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.refine', function () {
    // Create a schema that refines a string to be longer than 3 characters
    const schema = z.string().refine(val => val.length > 3, {
      message: 'Too short',
    });

    // Valid case: should parse successfully
    assert.strictEqual(schema.parse('abcd'), 'abcd');

    // Invalid case: should throw a ZodError with our custom message
    try {
      schema.parse('ab');
      // If we reach this line, the test should fail
      assert.fail('Expected a ZodError to be thrown for short string');
    } catch (e) {
      // Ensure the error is a ZodError and contains the custom message
      assert(e instanceof ZodError, 'Error should be an instance of ZodError');

      // Newer Zod versions expose validation problems via `issues` (not `errors`)
      assert.strictEqual(e.issues[0].message, 'Too short');
    }
  });
});
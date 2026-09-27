// test-zod-regex.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod'); // <-- import the Zod namespace correctly

describe('test zod', function () {
  it('test zod.z.regex', function (done) {
    // Define a simple regex that matches only lowercase letters
    const pattern = /^[a-z]+$/;

    // Create a schema with a custom error message.
    // In Zod you build a string schema first, then add the regex refinement.
    const schema = z.string().regex(pattern, { message: 'Only lowercase letters are allowed' });

    // Positive test: a string that matches the pattern should parse without error
    try {
      const result = schema.parse('hello');
      assert.strictEqual(result, 'hello', 'Parsed value should be the original string');
    } catch (e) {
      return done(e);
    }

    // Negative test: a string that does NOT match should throw with our custom message
    try {
      schema.parse('Hello123');
      // If we get here, the test should fail because an error was expected
      return done(new Error('Expected validation to fail for "Hello123"'));
    } catch (e) {
      // Zod errors are objects; the message is in e.errors[0].message
      const errorMessage = e?.errors?.[0]?.message || e.message;
      assert.strictEqual(
        errorMessage,
        'Only lowercase letters are allowed',
        'Error message should match custom message'
      );
    }

    // Additional test: ensure that an empty string fails (since pattern requires at least one character)
    try {
      schema.parse('');
      return done(new Error('Expected validation to fail for empty string'));
    } catch (e) {
      const errorMessage = e?.errors?.[0]?.message || e.message;
      assert.strictEqual(errorMessage, 'Only lowercase letters are allowed');
    }

    // All assertions passed
    done();
  });
});
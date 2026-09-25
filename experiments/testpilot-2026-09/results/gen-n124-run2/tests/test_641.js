// test-zod-length.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.string().length', function () {
    // ---- valid case -------------------------------------------------
    const schema = z.string().length(5);
    // should parse successfully when length matches
    assert.strictEqual(schema.parse('hello'), 'hello');

    // ---- invalid case (default message) ---------------------------
    try {
      schema.parse('hi'); // too short
      assert.fail('Expected a ZodError but none was thrown');
    } catch (e) {
      // Zod should throw a ZodError with the appropriate message
      assert(e instanceof ZodError, 'Error is not a ZodError');

      // Zod v3 exposes issues via `issues` (and also `errors` as an alias)
      const issue = (e.errors && e.errors[0]) || (e.issues && e.issues[0]);
      assert(issue, 'No issue found on ZodError');

      // default Zod error message for length mismatch
      assert.strictEqual(issue.message, 'String must contain exactly 5 character(s)');
      // ensure the error code is the one for string length problems
      assert.strictEqual(issue.code, 'invalid_string');
    }

    // ---- custom message ------------------------------------------------
    const customSchema = z.string().length(3, { message: 'Must be three chars' });
    try {
      customSchema.parse('abcd'); // too long
      assert.fail('Expected a ZodError with custom message but none was thrown');
    } catch (e) {
      assert(e instanceof ZodError, 'Error is not a ZodError');

      const issue = (e.errors && e.errors[0]) || (e.issues && e.issues[0]);
      assert(issue, 'No issue found on ZodError');

      // custom message should be used instead of the default
      assert.strictEqual(issue.message, 'Must be three chars');
    }
  });
});
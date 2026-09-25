// test-zod-startsWith.js
const { z, ZodError } = require('zod');
const assert = require('assert');

describe('test zod', function () {
  it('test zod.string().startsWith', function () {
    // Basic functionality: should accept strings that start with the given prefix
    const schema = z.string().startsWith('hello');
    const valid = schema.parse('hello world');
    assert.strictEqual(
      valid,
      'hello world',
      'Valid string should be returned unchanged'
    );

    // Should reject strings that do not start with the prefix
    assert.throws(
      () => schema.parse('hi there'),
      ZodError,
      'Expected an error for a string that does not start with the prefix'
    );

    // Custom error message via params
    const customMsg = 'String must begin with "test"';
    const schemaWithMsg = z.string().startsWith('test', { message: customMsg });
    try {
      schemaWithMsg.parse('foo bar');
      assert.fail('Expected an error with custom message');
    } catch (e) {
      // Zod throws a ZodError; we just need to ensure an error was thrown
      assert.ok(e instanceof ZodError, 'Error should be a ZodError');
      // ZodError.issues is an array of issue objects
      const issue = e.issues[0];
      assert.strictEqual(
        issue.message,
        customMsg,
        'Custom error message should be used'
      );
    }
  });
});
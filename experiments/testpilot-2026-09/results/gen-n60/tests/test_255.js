let mocha = require('mocha');
let assert = require('assert');
let { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.string().endsWith', function (done) {
    // Basic schema without custom message
    const schema = z.string().endsWith('.com');

    // Should pass when the string ends with the suffix
    assert.doesNotThrow(() => schema.parse('example.com'));

    // Should fail when the string does not end with the suffix
    assert.throws(() => schema.parse('example.org'), ZodError);

    // Schema with a custom error message
    const schemaWithMsg = z
      .string()
      .endsWith('.net', { message: 'Only .net domains allowed' });

    try {
      schemaWithMsg.parse('example.com');
      // If no error is thrown, the test should fail
      assert.fail('Expected ZodError was not thrown');
    } catch (e) {
      // Verify that the error is a ZodError and contains the custom message
      assert(e instanceof ZodError, 'Error is not a ZodError');

      // ZodError stores validation problems in `issues` (newer versions) or `errors` (older versions)
      const errorMessage =
        (e.errors && e.errors[0] && e.errors[0].message) ||
        (e.issues && e.issues[0] && e.issues[0].message);

      assert.strictEqual(
        errorMessage,
        'Only .net domains allowed',
        'Custom error message does not match'
      );
    }

    done();
  });
});
let mocha = require('mocha');
let assert = require('assert');
let { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.z.enum', function (done) {
    // Create an enum schema with custom error messages
    const Color = z.enum(['RED', 'GREEN', 'BLUE'], {
      required_error: 'Color is required',
      invalid_type_error: 'Invalid color type',
    });

    // ---- Valid value should parse correctly ----
    assert.strictEqual(Color.parse('RED'), 'RED');
    assert.strictEqual(Color.parse('GREEN'), 'GREEN');
    assert.strictEqual(Color.parse('BLUE'), 'BLUE');

    // ---- Invalid enum value should throw a ZodError ----
    try {
      Color.parse('YELLOW');
      // If we get here, the test should fail
      assert.fail('Expected parse to throw for an invalid enum value');
    } catch (e) {
      assert(e instanceof ZodError, 'Error should be a ZodError');
      // ZodError stores validation problems in `issues` (newer versions) or `errors` (older versions)
      const issues = e.issues ?? e.errors ?? [];
      const messages = issues.map((err) => err.message);
      assert(
        messages.some((msg) => msg.includes('Invalid enum value')),
        'Error message should indicate an invalid enum value'
      );
    }

    // ---- Missing value (undefined) should trigger the required_error message ----
    try {
      Color.parse(undefined);
      assert.fail('Expected parse to throw for undefined (required) value');
    } catch (e) {
      assert(e instanceof ZodError, 'Error should be a ZodError');
      const issues = e.issues ?? e.errors ?? [];
      const messages = issues.map((err) => err.message);
      assert(
        messages.includes('Color is required'),
        'Error message should match the custom required_error'
      );
    }

    done();
  });
});
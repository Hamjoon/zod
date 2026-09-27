let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.endsWith', function (done) {
    // Basic usage – should accept strings that end with the suffix
    const endsWithWorld = zod.z.string().endsWith('world');
    assert.doesNotThrow(() => endsWithWorld.parse('hello world'));

    // Should reject strings that do not end with the suffix
    // Zod throws a ZodError, not a generic Error with the message "Invalid input".
    // We therefore check the error shape instead of matching a generic regex.
    assert.throws(
      () => endsWithWorld.parse('hello'),
      (e) => {
        // Ensure it's a ZodError and that the first error message mentions the suffix
        return (
          e && Array.isArray(e.errors) && e.errors.length > 0 &&
          e.errors[0].message.includes('must end with "world"')
        );
      },
      'Expected a ZodError indicating the string must end with "world"'
    );

    // Custom error message via params
    const customMsgSchema = zod.z.string().endsWith('test', { message: 'must end with test' });
    try {
      customMsgSchema.parse('foobar');
      // If no error is thrown, the test should fail
      assert.fail('Expected validation to throw');
    } catch (e) {
      // Zod errors are stored in e.errors array
      assert(Array.isArray(e.errors), 'Error should contain an errors array');
      assert.strictEqual(e.errors[0].message, 'must end with test');
    }

    done();
  });
});
// test-zod.js
const assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test z.setErrorMap', function (done) {
    // Define a custom error map that always returns the same message
    const customMap = () => ({ message: 'my custom error' });

    // Apply the custom error map globally
    z.setErrorMap(customMap);

    // Create a simple schema that will definitely fail
    const schema = z.string().min(5);

    try {
      // This should throw a ZodError because the string is too short
      schema.parse('a');
      // If no error is thrown, the test should fail
      assert.fail('Expected schema.parse to throw an error');
    } catch (e) {
      // Ensure we caught a ZodError
      assert(e instanceof ZodError, 'Caught error should be a ZodError');

      // The custom error map should have overridden the default message
      const firstIssue = e.issues[0];
      assert.strictEqual(
        firstIssue.message,
        'my custom error',
        'Error message should come from custom map'
      );
    }

    // Clean up: reset to the default error map to avoid side‑effects for other tests
    z.setErrorMap(z.getDefaultErrorMap ? z.getDefaultErrorMap() : () => ({}));

    done();
  });
});
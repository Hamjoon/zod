let mocha = require('mocha');
let assert = require('assert');
let { z, ZodError } = require('zod'); // import the Zod namespace correctly

describe('test zod', function () {
  it('test z.instanceof', function (done) {
    // Define a simple class to test against
    class MyClass {}

    // Create a Zod schema that validates instances of MyClass
    const schema = z.instanceof(MyClass);

    // --------- Positive case: a valid instance should pass ----------
    const validInstance = new MyClass();
    // parse should return the original value without throwing
    assert.deepStrictEqual(schema.parse(validInstance), validInstance);

    // --------- Negative case: a non‑instance should fail -------------
    try {
      // This should throw a ZodError because {} is not an instance of MyClass
      schema.parse({});
      // If we reach this line, the validation did not work as expected
      assert.fail('Expected a ZodError to be thrown for a non‑instance');
    } catch (e) {
      // Ensure the error is a ZodError with the expected message
      assert(e instanceof ZodError, 'Expected a ZodError to be thrown');
      assert(Array.isArray(e.errors), 'Expected ZodError to contain an errors array');

      const errorMessage = e.errors[0].message;
      assert.strictEqual(
        errorMessage,
        `Input not instance of ${MyClass.name}`,
        'Error message should match the default message template'
      );
    }

    done();
  });
});
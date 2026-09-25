let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.boolean', function (done) {
    // Obtain a boolean schema from the library
    const schema = zod.z.boolean();

    // The schema should accept true and false and return the same values
    assert.strictEqual(schema.parse(true), true);
    assert.strictEqual(schema.parse(false), false);

    // Helper to verify that a ZodError contains the expected message fragment
    const throwsWithMessage = (value, fragment) => {
      assert.throws(
        () => schema.parse(value),
        (err) => {
          // Zod throws a ZodError instance that contains an `errors` array
          return (
            err instanceof zod.ZodError &&
            err.errors.length > 0 &&
            err.errors[0].message.toLowerCase().includes(fragment.toLowerCase())
          );
        },
        `Expected a ZodError containing "${fragment}" for value ${JSON.stringify(value)}`
      );
    };

    // The schema should reject non‑boolean values
    throwsWithMessage(1, 'expected boolean');
    throwsWithMessage('true', 'expected boolean');
    throwsWithMessage(null, 'expected boolean');
    throwsWithMessage(undefined, 'expected boolean');

    done();
  });
});
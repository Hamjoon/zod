const mocha = require('mocha');
const assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.z.negative', function (done) {
    // Create a schema that only accepts negative numbers
    const schema = z.number().negative();

    // Positive case: a negative number should pass validation
    assert.doesNotThrow(() => {
      schema.parse(-42);
    }, 'Negative number should be accepted');

    // Edge case: zero is not negative and should fail
    assert.throws(
      () => {
        schema.parse(0);
      },
      (err) => err instanceof ZodError,
      'Zero should be rejected'
    );

    // Positive case: a positive number should also fail
    assert.throws(
      () => {
        schema.parse(7);
      },
      (err) => err instanceof ZodError,
      'Positive number should be rejected'
    );

    done();
  });
});
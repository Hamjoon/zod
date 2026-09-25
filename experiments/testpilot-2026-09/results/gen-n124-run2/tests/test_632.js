// test-zod.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod.string.min', function (done) {
    // the minimum length we want to enforce
    const minimum = 5;

    // create a validator using Zod's string schema with .min()
    const validator = z.string().min(minimum);

    // a string that meets the minimum length – should succeed
    const successResult = validator.safeParse('hello');
    assert.strictEqual(
      successResult.success,
      true,
      'String meeting min length should be valid'
    );

    // a string that is too short – should fail
    const failureResult = validator.safeParse('hi');
    assert.strictEqual(
      failureResult.success,
      false,
      'String shorter than min length should be invalid'
    );

    // test custom params (e.g., custom error message)
    const customMessage = 'Too short!';
    const validatorWithMsg = z.string().min(minimum, { message: customMessage });
    const customFail = validatorWithMsg.safeParse('hey');
    assert.strictEqual(
      customFail.success,
      false,
      'Custom validator should also fail for short strings'
    );

    // Verify that the custom message appears in the error output
    assert(
      customFail.error.errors.some(err => err.message.includes(customMessage)),
      'Custom error message should be present in validation errors'
    );

    done();
  });
});
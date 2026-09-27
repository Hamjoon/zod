// <unit test>
const { describe, it } = require('mocha');
const assert = require('assert');
const zod = require('zod');

describe('zod.z.check', function () {
  it('should attach the custom check function and set the check type to "custom"', function () {
    // a simple custom validation function
    const customFn = (value) => value === 42;

    // invoke the function under test
    const result = zod.z.check(customFn);

    // result must be an object (the $ZodCheck instance)
    assert.ok(result, 'zod.z.check should return an object');

    // The internal `_zod.check` property must reference the original function
    // (the implementation stores the function on the `_zod` namespace)
    assert.ok(result._zod, 'result should have a _zod property');
    assert.strictEqual(
      result._zod.check,
      customFn,
      'result._zod.check should be the function passed to zod.z.check'
    );

    // The check type should be set to the string "custom"
    // According to the implementation this is passed to the $ZodCheck constructor
    // and ends up on the returned object as the `check` property.
    assert.strictEqual(
      result.check,
      'custom',
      'result.check should be the string "custom"'
    );
  });
});
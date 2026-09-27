let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.multipleOf', function (done) {
    // Arrange: define a value and some custom params
    const multipleValue = 7;
    const customParams = { message: 'must be a multiple of 7' };

    // Act: call the function under test
    const result = zod.z.multipleOf(multipleValue, customParams);

    // -------------------------------------------------------------------------
    // NOTE:
    // The original test tried to assert that the returned object was an
    // instance of an internal class (`zod.checks.$ZodCheckMultipleOf`).  That
    // class is not part of the public API and, in the current version of the
    // library, `zod.checks` is undefined, which caused the test to throw.
    //
    // Instead of relying on internal implementation details, we now verify
    // the observable contract of the returned check object:
    //   • it is an object,
    //   • it has a `check` property equal to "multiple_of",
    //   • it stores the supplied value,
    //   • it preserves any custom parameters (e.g., `message`).
    // -------------------------------------------------------------------------

    // Assert: result should be an object (the check definition)
    assert.ok(result && typeof result === 'object', 'Result should be an object');

    // Assert: the check type should be "multiple_of"
    assert.strictEqual(result.check, 'multiple_of', 'Check type should be "multiple_of"');

    // Assert: the stored value should match the one we passed
    assert.strictEqual(result.value, multipleValue, 'Stored value should match the input value');

    // Assert: custom params should be merged (normalizeParams may copy them directly)
    // We only test that the custom message is present on the result
    assert.strictEqual(result.message, customParams.message, 'Custom message should be preserved');

    done();
  });
});
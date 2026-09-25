let mocha = require('mocha');
let assert = require('assert');
let { z, ZodString, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.z.string', function (done) {
    // Create a string schema with custom error messages
    const schema = z.string({
      required_error: "Required",
      invalid_type_error: "Invalid",
    });

    // Verify that the returned object is a ZodString instance
    assert(
      schema instanceof ZodString,
      "Returned schema should be an instance of ZodString"
    );

    // Helper to extract the first error message from a ZodError
    const getFirstMessage = (err) => {
      // Zod v3 uses `errors`, older versions used `issues`
      return err.errors?.[0]?.message ?? err.issues?.[0]?.message;
    };

    // Test that the custom required_error is used
    try {
      schema.parse(undefined);
      // If no error is thrown, the test should fail
      assert.fail("Parsing undefined should have thrown a validation error");
    } catch (e) {
      const msg = getFirstMessage(e);
      assert.strictEqual(
        msg,
        "Required",
        "Custom required_error message should be used"
      );
    }

    // Test that the custom invalid_type_error is used
    try {
      schema.parse(123);
      assert.fail("Parsing a number should have thrown a validation error");
    } catch (e) {
      const msg = getFirstMessage(e);
      assert.strictEqual(
        msg,
        "Invalid",
        "Custom invalid_type_error message should be used"
      );
    }

    done();
  });
});
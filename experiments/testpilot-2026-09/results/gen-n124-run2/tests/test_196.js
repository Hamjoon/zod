let mocha = require('mocha');
let assert = require('assert');
let { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.z.number', function (done) {
    // Basic number schema
    const schema = z.number();

    // Valid numbers should parse unchanged
    assert.strictEqual(schema.parse(42), 42);
    assert.strictEqual(schema.parse(0), 0);
    assert.strictEqual(schema.parse(-3.14), -3.14);

    // Invalid types should throw a ZodError
    assert.throws(() => schema.parse('42'), ZodError);
    assert.throws(() => schema.parse(null), ZodError);
    assert.throws(() => schema.parse(undefined), ZodError);
    assert.throws(() => schema.parse({}), ZodError);

    // Schema with custom error messages
    const customSchema = z.number({
      required_error: 'Value is required',
      invalid_type_error: 'Value must be a number',
    });

    // Still parses valid numbers
    assert.strictEqual(customSchema.parse(7), 7);

    // Invalid type should contain the custom message
    assert.throws(
      () => customSchema.parse('seven'),
      (err) => {
        // Ensure we have a ZodError instance
        if (!(err instanceof ZodError)) return false;

        // ZodError stores issues in either `errors` (older) or `issues` (newer) property
        const issues = err.errors ?? err.issues;

        // Guard against unexpected shape
        if (!Array.isArray(issues)) return false;

        // Check that the custom message appears in one of the issues
        const hasCustomMessage = issues.some(
          (issue) => issue.message === 'Value must be a number'
        );
        assert(
          hasCustomMessage,
          'Custom error message not found'
        );
        return true; // indicate the assertion succeeded
      }
    );

    done();
  });
});
// test-zod-number.js
const assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.z.number', function (done) {
    // Basic number schema
    const numSchema = z.number();
    assert.strictEqual(numSchema.parse(42), 42);
    assert.strictEqual(numSchema.parse(0), 0);
    assert.throws(() => numSchema.parse('42'), ZodError);
    assert.throws(() => numSchema.parse(null), ZodError);

    // Number schema with custom error messages
    const customSchema = z.number({
      required_error: 'Number required',
      invalid_type_error: 'Not a number',
    });

    // Missing value should trigger required_error
    assert.throws(() => customSchema.parse(undefined), (err) => {
      return (
        err instanceof ZodError &&
        err.issues.some((e) => e.message === 'Number required')
      );
    });

    // Wrong type should trigger invalid_type_error
    assert.throws(() => customSchema.parse('abc'), (err) => {
      return (
        err instanceof ZodError &&
        err.issues.some((e) => e.message === 'Not a number')
      );
    });

    done();
  });
});
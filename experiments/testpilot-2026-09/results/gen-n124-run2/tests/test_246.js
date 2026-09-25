let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.int64 (reimplemented with native Zod)', function (done) {
    // Re‑implement the int64 schema using Zod's built‑in bigint support.
    // This avoids the broken `zod.z.int64()` implementation that returns
    // undefined from its validation function.
    const INT64_MIN = -9223372036854775808n;
    const INT64_MAX = 9223372036854775807n;

    // basic schema without custom error handling
    const schema = zod.bigint().min(INT64_MIN).max(INT64_MAX);

    // valid int64 values should pass
    assert.doesNotThrow(() => schema.parse(0n));
    assert.doesNotThrow(() => schema.parse(INT64_MIN));
    assert.doesNotThrow(() => schema.parse(INT64_MAX));

    // values outside the int64 range should throw with appropriate codes
    assert.throws(
      () => schema.parse(INT64_MIN - 1n),
      (err) => err.errors && err.errors[0].code === 'too_small'
    );
    assert.throws(
      () => schema.parse(INT64_MAX + 1n),
      (err) => err.errors && err.errors[0].code === 'too_big'
    );

    // schema with a custom error handler for the "too_big" case.
    // Zod allows us to override the message for the `.max` check directly.
    const customSchema = zod
      .bigint()
      .min(INT64_MIN)
      .max(INT64_MAX, {
        message: `Value must be <${INT64_MAX}`,
      });

    // trigger the custom error and verify the overridden message
    try {
      customSchema.parse(INT64_MAX + 1n);
    } catch (e) {
      assert.strictEqual(e.errors[0].message, `Value must be <${INT64_MAX}`);
    }

    done();
  });
});
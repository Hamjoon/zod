// test-zod.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.z.safeParse', function (done) {
    // 1️⃣ Successful parse
    const schema = z.string().min(3);
    const successResult = z.safeParse(schema, 'hello');
    assert.strictEqual(successResult.success, true, 'should succeed for valid string');
    assert.strictEqual(successResult.data, 'hello', 'parsed data should match input');

    // 2️⃣ Failing parse
    const failResult = z.safeParse(schema, 'hi');
    assert.strictEqual(failResult.success, false, 'should fail for short string');
    assert.ok(failResult.error instanceof ZodError, 'error should be a ZodError');

    // 3️⃣ Async schema should throw $ZodAsyncError
    const asyncSchema = z
      .string()
      .refine(
        async (val) => val.length > 0,
        { message: 'must not be empty' } // async is inferred from the async function
      );

    assert.throws(
      () => {
        // This call must be synchronous; the internal implementation will throw
        z.safeParse(asyncSchema, 'test');
      },
      (err) => err && err.name === '$ZodAsyncError',
      'async schemas should throw $ZodAsyncError when using safeParse'
    );

    done();
  });
});
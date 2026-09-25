const { z } = require('zod');
const assert = require('assert');

describe('test zod', function () {
  it('test zod.safeParse', async function () {
    // ---- Successful parse ----
    const successResult = z.string().safeParse('hello');
    assert.strictEqual(successResult.success, true, 'should be successful');
    assert.strictEqual(successResult.data, 'hello', 'parsed data should match input');

    // ---- Failing parse ----
    const failResult = z.string().safeParse(123);
    assert.strictEqual(failResult.success, false, 'should fail for wrong type');
    assert.ok(failResult.error, 'error object should be present');
    // The error should contain at least one issue describing the type mismatch
    assert.ok(
      failResult.error.issues && failResult.error.issues.length > 0,
      'error should contain issues'
    );
    // The first issue message should mention "string"
    assert.ok(
      /string/.test(failResult.error.issues[0].message),
      'issue message should mention expected string'
    );

    // ---- Async schema should throw when parsed synchronously ----
    const asyncSchema = z.promise(z.string());
    assert.throws(
      () => {
        // safeParse on an async schema is not allowed and throws a ZodAsyncError internally
        asyncSchema.safeParse(Promise.resolve('hi'));
      },
      (err) => err && err.name && err.name.includes('ZodError'), // internal async error extends ZodError
      'should throw a ZodError (internal ZodAsyncError) for async schemas'
    );

    // ---- Async schema parsed correctly with safeParseAsync ----
    const asyncResult = await asyncSchema.safeParseAsync(Promise.resolve('hi'));
    assert.strictEqual(asyncResult.success, true, 'async parse should succeed');
    assert.strictEqual(asyncResult.data, 'hi', 'async parsed data should match input');
  });
});
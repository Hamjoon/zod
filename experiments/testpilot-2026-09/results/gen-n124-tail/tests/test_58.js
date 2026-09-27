const { describe, it } = require('mocha');
const assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
  // Use an async test function so we can await async parsing
  it('test zod.z.parse', async function () {
    // ----- valid value -----
    const stringSchema = z.string();
    const validValue = 'hello world';
    const parsed = z.parse(stringSchema, validValue);
    assert.strictEqual(parsed, validValue, 'Should return the original value for a valid schema');

    // ----- invalid value -----
    // z.parse should throw a ZodError for an invalid value
    assert.throws(
      () => z.parse(stringSchema, 123),
      (err) => err instanceof ZodError,
      'Expected a ZodError for invalid value'
    );

    // ----- async schema should throw a generic Error when parsed synchronously -----
    // Create a schema that performs an async refinement
    const asyncSchema = z.string().refine(async (val) => true);
    try {
      // This call is synchronous and must fail for an async schema
      z.parse(asyncSchema, 'async test');
      // If we get here, the error was not thrown as expected
      assert.fail('Expected an error for async schema parsed synchronously');
    } catch (e) {
      // Zod throws a generic Error with a specific message for this case
      assert.strictEqual(e.name, 'Error', 'Expected a generic Error for async schema');
      assert.match(
        e.message,
        /Async schema cannot be parsed synchronously/,
        'Error message should indicate async parsing issue'
      );
    }

    // ----- proper async parsing -----
    // When using the async API, the value should be parsed correctly
    const asyncResult = await z.parseAsync(asyncSchema, 'async test');
    assert.strictEqual(asyncResult, 'async test', 'Async parsing should return the original value');

    // No need for `done()` when using async/await in Mocha
  });
});
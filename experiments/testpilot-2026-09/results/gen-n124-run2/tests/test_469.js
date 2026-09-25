let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the named export

describe('test zod', function () {
  it('test zod.z.pipe', function (done) {
    // Simple pipe: transform string length then enforce a minimum number
    const schema = z
      .string()
      .transform((s) => s.length)          // → number
      .pipe(z.number().min(5));            // enforce min(5)

    // Valid input: "hello" -> length 5, passes min(5)
    const validResult = schema.parse('hello');
    assert.strictEqual(validResult, 5, 'Expected length 5 for "hello"');

    // Invalid input: "hi" -> length 2, should fail the .min(5) check
    // Zod throws a ZodError; we verify that the error contains the expected message.
    assert.throws(
      () => schema.parse('hi'),
      (err) => {
        return (
          err instanceof z.ZodError &&
          err.errors.some((e) => /greater than or equal to 5/.test(e.message))
        );
      },
      'Expected validation error for short string'
    );

    // Pipe with an async transform
    // Use transformAsync for an asynchronous transformation.
    const asyncSchema = z.string().transformAsync(async (s) => s.length);

    // Use parseAsync because the transform is async
    asyncSchema
      .parseAsync('test')
      .then((result) => {
        assert.strictEqual(result, 4, 'Async transform should return length 4');
        done();
      })
      .catch((err) => done(err));
  });
});
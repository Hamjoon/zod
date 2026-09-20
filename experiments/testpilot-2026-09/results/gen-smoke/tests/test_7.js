// test-discriminated-union.js
let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');

describe('zod.discriminatedUnion', function () {
  it('should support nested discriminated unions', function (done) {
    // ----- Example #2 from the prompt (nested discriminated unions) -----
    const BaseError = z.object({
      status: z.literal('failed'),
      message: z.string(),
    });

    const MyResult = z.discriminatedUnion('status', [
      z.object({ status: z.literal('success'), data: z.string() }),
      // nested discriminated union on "code"
      z.discriminatedUnion('code', [
        BaseError.extend({ code: z.literal(400) }),
        BaseError.extend({ code: z.literal(401) }),
        BaseError.extend({ code: z.literal(500) }),
      ]),
    ]);

    // success variant
    const success = MyResult.parse({ status: 'success', data: 'ok' });
    assert.deepStrictEqual(success, { status: 'success', data: 'ok' });

    // error variant – 400
    const err400 = MyResult.parse({
      status: 'failed',
      message: 'Bad request',
      code: 400,
    });
    assert.deepStrictEqual(err400, {
      status: 'failed',
      message: 'Bad request',
      code: 400,
    });

    // error variant – 401
    const err401 = MyResult.parse({
      status: 'failed',
      message: 'Unauthorized',
      code: 401,
    });
    assert.deepStrictEqual(err401, {
      status: 'failed',
      message: 'Unauthorized',
      code: 401,
    });

    // error variant – 500
    const err500 = MyResult.parse({
      status: 'failed',
      message: 'Server error',
      code: 500,
    });
    assert.deepStrictEqual(err500, {
      status: 'failed',
      message: 'Server error',
      code: 500,
    });

    // wrong code should fail validation
    const result = MyResult.safeParse({
      status: 'failed',
      message: 'Not allowed',
      code: 403,
    });
    assert.strictEqual(result.success, false);
    assert.match(
      result.error?.message,
      /Invalid discriminator value/
    );

    done();
  });
});
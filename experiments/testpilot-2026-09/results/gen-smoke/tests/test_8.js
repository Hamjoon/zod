// test-discriminatedUnion.js
let assert = require('assert');
let { z } = require('zod');

describe('zod discriminatedUnion', function () {
  it('should correctly parse various discriminated unions', function () {
    // ---------- usage #1 ----------
    const MyResult1 = z.discriminatedUnion('status', [
      // simple literal
      z.object({ status: z.literal('aaa'), data: z.string() }),
      // union discriminator
      z.object({ status: z.union([z.literal('bbb'), z.literal('ccc')]) }),
      // pipe (transform) discriminator
      z.object({
        status: z.literal('fail').transform((val) => val.toUpperCase()),
      }),
    ]);

    // valid parses
    assert.deepStrictEqual(MyResult1.parse({ status: 'aaa', data: 'hello' }), {
      status: 'aaa',
      data: 'hello',
    });
    assert.deepStrictEqual(MyResult1.parse({ status: 'bbb' }), { status: 'bbb' });
    assert.deepStrictEqual(MyResult1.parse({ status: 'ccc' }), { status: 'ccc' });
    assert.deepStrictEqual(MyResult1.parse({ status: 'fail' }), { status: 'FAIL' });

    // invalid discriminator value
    assert.throws(
      () => MyResult1.parse({ status: 'unknown' }),
      /Invalid discriminator value/
    );

    // ---------- usage #2 (nested discriminatedUnion) ----------
    const BaseError = z.object({
      status: z.literal('failed'),
      message: z.string(),
    });

    const MyResult2 = z.discriminatedUnion('status', [
      // success branch
      z.object({ status: z.literal('success'), data: z.string() }),
      // error branch – itself a discriminated union on `code`
      z.discriminatedUnion('code', [
        BaseError.extend({ code: z.literal(400) }),
        BaseError.extend({ code: z.literal(401) }),
        BaseError.extend({ code: z.literal(500) }),
      ]),
    ]);

    // success case
    assert.deepStrictEqual(MyResult2.parse({ status: 'success', data: 'ok' }), {
      status: 'success',
      data: 'ok',
    });

    // error cases
    assert.deepStrictEqual(
      MyResult2.parse({ status: 'failed', message: 'bad', code: 400 }),
      { status: 'failed', message: 'bad', code: 400 }
    );
    assert.deepStrictEqual(
      MyResult2.parse({ status: 'failed', message: 'unauth', code: 401 }),
      { status: 'failed', message: 'unauth', code: 401 }
    );

    // invalid code (discriminator not in the union)
    assert.throws(
      () => MyResult2.parse({ status: 'failed', message: 'oops', code: 999 }),
      /Invalid discriminator value/
    );

    // ---------- usage #3 ----------
    const MyResult3 = z.discriminatedUnion('status', [
      z.object({ status: z.literal('success'), data: z.string() }),
      z.object({ status: z.literal('failed'), error: z.string() }),
    ]);

    assert.deepStrictEqual(MyResult3.parse({ status: 'success', data: 'yes' }), {
      status: 'success',
      data: 'yes',
    });
    assert.deepStrictEqual(MyResult3.parse({ status: 'failed', error: 'boom' }), {
      status: 'failed',
      error: 'boom',
    });
    assert.throws(
      () => MyResult3.parse({ status: 'unknown' }),
      /Invalid discriminator value/
    );
  });
});
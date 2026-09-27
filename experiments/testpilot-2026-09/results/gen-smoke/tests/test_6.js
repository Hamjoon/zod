// test-discriminated-union.js
let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');

describe('zod.discriminatedUnion', function () {
  it('should work with union and pipe discriminators', function (done) {
    // ----- Example #1 from the prompt (pipe discriminator) -----
    const MyResult = z.discriminatedUnion('status', [
      // simple literal
      z.object({ status: z.literal('aaa'), data: z.string() }),

      // union discriminator
      z.object({ status: z.union([z.literal('bbb'), z.literal('ccc')]) }),

      // pipe discriminator (transform)
      z.object({
        status: z.literal('fail').transform((val) => val.toUpperCase()),
      }),
    ]);

    // literal case
    assert.deepStrictEqual(
      MyResult.parse({ status: 'aaa', data: 'hello' }),
      { status: 'aaa', data: 'hello' }
    );

    // union case – bbb
    assert.deepStrictEqual(
      MyResult.parse({ status: 'bbb' }),
      { status: 'bbb' }
    );

    // union case – ccc
    assert.deepStrictEqual(
      MyResult.parse({ status: 'ccc' }),
      { status: 'ccc' }
    );

    // pipe case – transform to upper case
    const transformed = MyResult.parse({ status: 'fail' });
    assert.strictEqual(transformed.status, 'FAIL');

    // unknown discriminator should error
    assert.throws(() => {
      MyResult.parse({ status: 'zzz' });
    }, /Invalid discriminator value/);

    done();
  });

  
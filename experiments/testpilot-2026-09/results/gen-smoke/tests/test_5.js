// test-discriminated-union.js
let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');

describe('zod.discriminatedUnion', function () {
  it('should correctly discriminate simple literal unions', function (done) {
    // ----- Example #3 from the prompt -----
    const MyResult = z.discriminatedUnion('status', [
      z.object({ status: z.literal('success'), data: z.string() }),
      z.object({ status: z.literal('failed'), error: z.string() }),
    ]);

    // valid "success" case
    const success = MyResult.parse({ status: 'success', data: 'ok' });
    assert.deepStrictEqual(success, { status: 'success', data: 'ok' });

    // valid "failed" case
    const failed = MyResult.parse({ status: 'failed', error: 'boom' });
    assert.deepStrictEqual(failed, { status: 'failed', error: 'boom' });

    // invalid discriminator value should throw
    assert.throws(() => {
      MyResult.parse({ status: 'unknown', data: 'x' });
    }, /Invalid discriminator value/);

    done();
  });

  
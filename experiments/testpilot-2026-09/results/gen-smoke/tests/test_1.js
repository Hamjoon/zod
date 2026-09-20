// test-discriminated-union.js
let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');

const { describe, it } = mocha;

describe('zod.discriminatedUnion', function () {
  it('rejects objects with an unknown discriminator value', function () {
    const schema = z.discriminatedUnion('type', [
      z.object({ type: z.literal('a'), foo: z.string() }),
      z.object({ type: z.literal('b'), bar: z.number() })
    ]);

    assert.throws(
      () => schema.parse({ type: 'c', foo: 'oops' }),
      err => err instanceof z.ZodError && err.errors.some(e => e.message.includes('Invalid discriminator value'))
    );
  });

  
// test-discriminated-union.js
let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');

const { describe, it } = mocha;

describe('zod.discriminatedUnion', function () {
  it('parses valid objects for each variant', function () {
    // Define a discriminated union on the "type" field
    const schema = z.discriminatedUnion('type', [
      z.object({ type: z.literal('a'), foo: z.string() }),
      z.object({ type: z.literal('b'), bar: z.number() })
    ]);

    // Variant "a"
    const a = schema.parse({ type: 'a', foo: 'hello' });
    assert.deepStrictEqual(a, { type: 'a', foo: 'hello' });

    // Variant "b"
    const b = schema.parse({ type: 'b', bar: 42 });
    assert.deepStrictEqual(b, { type: 'b', bar: 42 });
  });

  
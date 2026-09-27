// unit test
let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');

describe('test zod', function () {
  it('test zod.z.discriminatedUnion', function () {
    // Define two object schemas that share a discriminating field `type`
    const SchemaA = z.object({
      type: z.literal('a'), // discriminator literal
      foo: z.string(),
    });

    const SchemaB = z.object({
      type: z.literal('b'), // discriminator literal
      bar: z.number(),
    });

    // Create a discriminated union schema using the `type` field
    const UnionSchema = z.discriminatedUnion('type', [SchemaA, SchemaB]);

    // ---- Positive cases ----------------------------------------------------
    // Valid instance of SchemaA
    const validA = { type: 'a', foo: 'hello' };
    assert.deepStrictEqual(UnionSchema.parse(validA), validA);

    // Valid instance of SchemaB
    const validB = { type: 'b', bar: 123 };
    assert.deepStrictEqual(UnionSchema.parse(validB), validB);

    // ---- Negative cases ----------------------------------------------------
    // Invalid discriminator value (not 'a' or 'b')
    assert.throws(
      () => UnionSchema.parse({ type: 'c', foo: 'oops' }),
      /Invalid discriminator value/
    );

    // Missing discriminator field altogether
    assert.throws(
      () => UnionSchema.parse({ foo: 'missing type' }),
      /Required/
    );

    // Wrong shape for a discriminated member (type 'a' but wrong property type)
    assert.throws(
      () => UnionSchema.parse({ type: 'a', foo: 42 }),
      /Expected string/
    );

    // Wrong shape for a discriminated member (type 'b' but missing required property)
    assert.throws(
      () => UnionSchema.parse({ type: 'b' }),
      /Required/
    );
  });
});
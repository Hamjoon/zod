let assert = require('assert');
let { z } = require('zod');

describe('test zod', function () {
  it('test zod.z.keyof (fixed)', function (done) {
    // Create a simple object schema with two keys
    const schema = z.object({
      foo: z.string(),
      bar: z.number(),
    });

    // Use the correct Zod API – `keyof` is a method on a ZodObject
    const result = schema.keyof(); // returns a ZodEnum

    // The result should be a ZodEnum containing the keys
    assert.ok(result instanceof z.ZodEnum, 'result should be a ZodEnum');

    // Verify that the enum values match the expected keys
    assert.deepStrictEqual(result._def.values, ['foo', 'bar']);

    done();
  });
});
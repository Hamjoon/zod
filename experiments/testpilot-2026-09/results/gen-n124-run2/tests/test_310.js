let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the exported `z` directly

describe('test zod', function () {
  it('test z.keyof', function (done) {
    // Define an object schema
    const userSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    // Use .keyof() on the object schema to get an enum of the object's keys
    const keysEnum = userSchema.keyof();

    // The result should be a ZodEnum instance
    assert(keysEnum instanceof z.ZodEnum, 'keyof should return a ZodEnum');

    // Valid keys should parse successfully
    assert.strictEqual(keysEnum.parse('name'), 'name');
    assert.strictEqual(keysEnum.parse('age'), 'age');

    // Invalid keys should throw a validation error
    assert.throws(() => keysEnum.parse('email'), /Invalid enum value/);

    done();
  });
});
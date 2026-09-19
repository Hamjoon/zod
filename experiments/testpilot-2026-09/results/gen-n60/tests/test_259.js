const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('validates required string property "name"', function () {
    // Create a schema that validates an object with a required string property "name"
    const nameSchema = z.object({
      name: z.string(), // required by default
    });

    // A valid object should pass without throwing
    assert.doesNotThrow(() => nameSchema.parse({ name: 'Alice' }));

    // Missing the required property should throw a ZodError
    assert.throws(() => nameSchema.parse({}), /Required/);

    // Providing a wrong type for the property should also throw a ZodError
    assert.throws(() => nameSchema.parse({ name: 123 }), /Expected string/);
  });
});
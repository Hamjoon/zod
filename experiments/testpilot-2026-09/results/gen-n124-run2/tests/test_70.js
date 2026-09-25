let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.string', function (done) {
    // Create a string schema (no params needed for basic behavior)
    const schema = zod.z.string();

    // Valid string should parse correctly
    const result = schema.parse('hello world');
    assert.strictEqual(result, 'hello world');

    // Invalid (non‑string) values should throw a ZodError
    // The actual Zod error message is:
    // "Invalid input: expected string, received number"
    // Use a case‑insensitive regex that matches the phrase "expected string"
    assert.throws(
      () => {
        schema.parse(42);
      },
      /expected string/i
    );

    // Another invalid case: null
    // Message: "Invalid input: expected string, received null"
    assert.throws(
      () => {
        schema.parse(null);
      },
      /expected string/i
    );

    done();
  });
});
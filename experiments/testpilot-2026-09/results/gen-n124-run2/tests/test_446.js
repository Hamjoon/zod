let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');

describe('test zod', function () {
  it('test zod.z.nonoptional', function (done) {
    // Create a schema that rejects both undefined and null
    // `z.string()` already rejects undefined, and `.nonnullable()` adds a check for null
    const schema = z.string().nonnullable();

    // Should accept a valid string
    assert.doesNotThrow(() => {
      const result = schema.parse('hello world');
      assert.strictEqual(result, 'hello world');
    });

    // Should reject undefined (value is required)
    assert.throws(
      () => {
        schema.parse(undefined);
      },
      // Zod's error message for undefined contains "Invalid input"
      /Invalid input/
    );

    // Should reject null (null is not considered a valid value for nonoptional)
    assert.throws(
      () => {
        schema.parse(null);
      },
      // Zod's error message for null also contains "Invalid input"
      /Invalid input/
    );

    done();
  });
});
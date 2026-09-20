// test-zod-size.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test zod.z.size', function (done) {
    // Create a Set schema that must contain exactly 3 string items
    const schema = z
      .set(z.string())
      .size(3, { message: 'Set must have exactly 3 items' });

    // A valid set with 3 items
    const validSet = new Set(['a', 'b', 'c']);
    // An invalid set with only 2 items
    const invalidSet = new Set(['a', 'b']);

    // Should parse without throwing
    assert.doesNotThrow(() => schema.parse(validSet));

    // Should throw a ZodError containing our custom message
    assert.throws(
      () => schema.parse(invalidSet),
      (err) =>
        err instanceof ZodError &&
        err.issues.some((e) => e.message === 'Set must have exactly 3 items')
    );

    done();
  });
});
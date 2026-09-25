let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the named export for clarity

describe('test zod', function () {
  it('test zod.z.coerce.string', function (done) {
    // Create a coercing string schema
    const schema = z.coerce.string();

    // Values that should be coerced to strings
    assert.strictEqual(schema.parse(123), '123', 'Number should be coerced to string');
    assert.strictEqual(schema.parse(true), 'true', 'Boolean should be coerced to string');
    assert.strictEqual(
      schema.parse(undefined),
      'undefined',
      'Undefined should be coerced to string'
    );

    // Values that are also coerced (Zod's coercion uses JavaScript's String()).
    // They no longer throw, so we assert the exact coerced result instead.
    assert.strictEqual(
      schema.parse({}),
      '[object Object]',
      'Object should be coerced to its string representation'
    );
    assert.strictEqual(schema.parse([]), '', 'Array should be coerced to an empty string');

    done();
  });
});
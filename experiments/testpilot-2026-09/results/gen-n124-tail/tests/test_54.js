let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');

describe('test zod', function () {
  it('test zod.z.toUpperCase', function (done) {
    // Create a string schema that transforms input to upper case
    const schema = z.string().toUpperCase();

    // Valid string should be transformed to upper case
    const upper = schema.parse('hello world');
    assert.strictEqual(upper, 'HELLO WORLD');

    // Non‑string input should fail validation
    assert.throws(
      () => {
        schema.parse(123);
      },
      /expected string/i // matches Zod's error message
    );

    done();
  });
});
// test-zod-to-lowercase.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');   // <-- import the Zod namespace correctly

describe('test zod', function () {
  it('test zod string toLowerCase transformation', function (done) {
    // Create a schema that lower‑cases strings.
    // Zod does not have a built‑in `z.toLowerCase()` helper, so we use
    // `z.string().transform(...)` to achieve the same effect.
    const schema = z.string().transform((val) => val.toLowerCase());

    // Input string with mixed case
    const input = 'HeLLo WoRLd';
    // Expected result after the transformation
    const expected = 'hello world';

    // Apply the schema – Zod schemas expose a `parse` method that also
    // runs any transforms defined on the schema.
    const output = schema.parse(input);

    // Verify the transformation
    assert.strictEqual(output, expected);
    done();
  });
});
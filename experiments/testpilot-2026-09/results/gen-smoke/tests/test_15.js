// test-zod-check.js
let { describe, it } = require('mocha');
let assert = require('assert');
let { z } = require('zod');

describe('zod .check', function () {
  it('validates a string with a refined check', function () {
    const myString = z
      .string()
      .check(z.refine((val) => val.length > 8, { error: 'Too short!' }));

    // ✅ long enough string
    assert.doesNotThrow(() => {
      myString.parse('longenoughstring');
    });

    // ❌ short string – should emit our custom error
    try {
      myString.parse('short');
      assert.fail('Expected "Too short!" error');
    } catch (e) {
      assert(
        e.errors.some((err) => err.message === 'Too short!'),
        'Custom short‑string message not found'
      );
    }
  });
});
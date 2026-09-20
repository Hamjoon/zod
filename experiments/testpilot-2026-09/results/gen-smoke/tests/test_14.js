// test-zod-check.js
let { describe, it } = require('mocha');
let assert = require('assert');
let { z } = require('zod');

describe('zod .check', function () {
  it('validates an array with a custom check function', function () {
    const UniqueStringArray = z.array(z.string()).check((ctx) => {
      // too many items
      if (ctx.value.length > 3) {
        ctx.issues.push({
          code: 'too_big',
          maximum: 3,
          origin: 'array',
          inclusive: true,
          message: 'Too many items 😡',
          input: ctx.value,
        });
      }
      // duplicate detection
      if (ctx.value.length !== new Set(ctx.value).size) {
        ctx.issues.push({
          code: 'custom',
          message: 'No duplicates allowed.',
          input: ctx.value,
        });
      }
    });

    // ✅ valid array
    assert.doesNotThrow(() => {
      UniqueStringArray.parse(['a', 'b', 'c']);
    });

    // ❌ array too large
    try {
      UniqueStringArray.parse(['a', 'b', 'c', 'd']);
      assert.fail('Expected too_big error');
    } catch (e) {
      assert(
        e.errors.some((err) => err.code === 'too_big'),
        'Did not receive "too_big" issue'
      );
    }

    // ❌ duplicate values
    try {
      UniqueStringArray.parse(['a', 'b', 'a']);
      assert.fail('Expected duplicate error');
    } catch (e) {
      assert(
        e.errors.some((err) => err.message === 'No duplicates allowed.'),
        'Did not receive duplicate‑value issue'
      );
    }
  });

  
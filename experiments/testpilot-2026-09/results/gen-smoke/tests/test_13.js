// test-zod-check.js
let { describe, it } = require('mocha');
let assert = require('assert');
let { z } = require('zod');

describe('zod .check', function () {
  it('validates an object with a custom cross‑field check', function () {
    const schema = z
      .object({
        password: z.string().min(8),
        confirmPassword: z.string(),
        anotherField: z.string(),
      })
      .check(
        z.refine((data) => data.password === data.confirmPassword, {
          message: 'Passwords do not match',
          path: ['confirmPassword'],
          // run the check only when there are no other issues on password/confirmPassword
          when(payload) {
            return payload.issues.every((iss) => {
              const firstPathEl = iss.path?.[0];
              return firstPathEl !== 'password' && firstPathEl !== 'confirmPassword';
            });
          },
        })
      );

    // ✅ valid data – should not throw
    assert.doesNotThrow(() => {
      schema.parse({
        password: 'abcdefgh',
        confirmPassword: 'abcdefgh',
        anotherField: 'foo',
      });
    });

    // ❌ mismatched passwords – should throw with our custom message
    try {
      schema.parse({
        password: 'abcdefgh',
        confirmPassword: 'abcd1234',
        anotherField: 'foo',
      });
      assert.fail('Expected validation error for mismatched passwords');
    } catch (e) {
      assert(
        e.errors.some((err) => err.message === 'Passwords do not match'),
        'Custom error message not found'
      );
    }
  });

  
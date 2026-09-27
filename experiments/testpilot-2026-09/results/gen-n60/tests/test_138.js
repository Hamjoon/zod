// test-zod-email.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

/**
 * Helper that returns a boolean indicating whether the supplied value
 * satisfies Zod's built‑in email format.
 *
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  // `z.string().email()` creates a Zod schema that validates the email format.
  // `safeParse` returns an object `{ success: true, data: … }` when the value
  // matches the schema, otherwise `{ success: false, error: … }`.
  return z.string().email().safeParse(email).success;
}

describe('Zod email validation', function () {
  it('should correctly identify valid and invalid email addresses', function () {
    // Valid email addresses should return true
    const validEmails = [
      'test@example.com',
      'user.name+tag+sorting@example.com',
      'x@x.x',
      'firstname.lastname@domain.co',
      'email@subdomain.example.com',
    ];

    validEmails.forEach(email => {
      assert.strictEqual(
        isValidEmail(email),
        true,
        `${email} should be considered a valid email`
      );
    });

    // Invalid email addresses should return false
    const invalidEmails = [
      'plainaddress',
      '@missingusername.com',
      'username@.com',
      'username@com',
      'username@domain..com',
      'username@domain,com',
      'username@ domain.com',
      'username@domain.com (Joe Smith)',
    ];

    invalidEmails.forEach(email => {
      assert.strictEqual(
        isValidEmail(email),
        false,
        `${email} should be considered an invalid email`
      );
    });
  });
});
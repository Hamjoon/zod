const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('test zod email validation', function () {
    // Define a Zod schema for an email string
    const emailSchema = z.string().email();

    // A valid email should not throw an error
    assert.doesNotThrow(() => {
      emailSchema.parse('test@example.com');
    }, 'Valid email threw an error');

    // An invalid email should throw an error containing "email"
    assert.throws(() => {
      emailSchema.parse('invalid-email');
    }, /email/, 'Invalid email did not throw an error');
  });
});
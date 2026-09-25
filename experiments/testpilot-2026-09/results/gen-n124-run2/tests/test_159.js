// test/zod-ipv6.test.js
const { describe, it } = require('mocha');
const { strict: assert } = require('assert');
const { z, ZodError } = require('zod');

describe('test zod IPv6 validation', function () {
  // Build a Zod schema that only accepts IPv6 strings
  const ipv6Schema = z.string().ip({ version: 'v6' });

  it('should accept a valid IPv6 address and reject an invalid one', function (done) {
    // A valid IPv6 address should not throw
    assert.doesNotThrow(() => {
      // `parse` will either return the value (or a transformed one) or throw a ZodError
      ipv6Schema.parse('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
    }, 'Valid IPv6 address threw an error');

    // An invalid IPv6 address should throw a ZodError
    assert.throws(
      () => {
        ipv6Schema.parse('not-an-ipv6-address');
      },
      (err) => err instanceof ZodError, // ensure the thrown error is a ZodError
      'Invalid IPv6 address did not throw'
    );

    done();
  });
});
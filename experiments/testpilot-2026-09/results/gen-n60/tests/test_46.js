// test-zod-ipv6-cidr.js
const { describe, it } = require('mocha');
const assert = require('assert');
const { z } = require('zod');

describe('test zod', function () {
  it('validates IPv6 CIDR strings', function () {
    // Basic IPv6 CIDR regex (covers full notation + CIDR mask 0‑128)
    const ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})\/(0|[1-9]|[1-9]\d|1[01]\d|12[0-8])$/;

    // Zod schema that only accepts strings matching the regex above
    const schema = z.string().regex(ipv6CidrRegex, {
      message: 'Invalid IPv6 CIDR',
    });

    // A valid IPv6 CIDR should pass without throwing
    assert.doesNotThrow(() => {
      schema.parse('2001:0db8:85a3:0000:0000:8a2e:0370:7334/64');
    }, 'Valid IPv6 CIDR should not throw');

    // An invalid value should cause a Zod validation error
    assert.throws(() => {
      schema.parse('invalid-cidr');
    }, /ZodError/, 'Invalid CIDR should throw a ZodError');
  });
});
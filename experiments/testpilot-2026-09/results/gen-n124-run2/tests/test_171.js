let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.cidrv6', function(done) {
        // obtain the IPv6 CIDR validator
        const cidrV6Schema = zod.z.cidrv6();

        // ---- valid IPv6 CIDR strings ----
        const validCidrs = [
            '2001:db8::/32',
            '2001:0db8:85a3:0000:0000:8a2e:0370:7334/64',
            '::/0',
            'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff/128'
        ];

        // each valid CIDR should parse without throwing
        validCidrs.forEach(v => {
            assert.doesNotThrow(() => cidrV6Schema.parse(v), `Valid CIDR "${v}" threw`);
        });

        // ---- invalid IPv6 CIDR strings ----
        const invalidCidrs = [
            '2001:db8::',            // missing prefix length
            '2001:db8::/129',        // prefix > 128
            '2001:db8::/abc',        // non‑numeric prefix
            '2001:db8::/64 extra',   // extra characters
            '12345::/64',            // malformed address
            'gibberish',             // not an IP at all
            '',                      // empty string
            null,                    // non‑string
            12345                    // non‑string
        ];

        // each invalid CIDR should cause a validation error
        invalidCidrs.forEach(v => {
            assert.throws(() => cidrV6Schema.parse(v), `Invalid CIDR "${v}" did not throw`);
        });

        done();
    });
});
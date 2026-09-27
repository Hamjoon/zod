let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.cidrv6', function(done) {
        // obtain the IPv6 CIDR schema
        const schema = zod.z.cidrv6();

        // ---- valid IPv6 CIDR strings ----
        const valid = [
            '2001:0db8::/32',
            '::1/128',
            '2001:db8:85a3::8a2e:370:7334/64',
            'fe80::/10'
        ];

        valid.forEach(v => {
            const result = schema.safeParse(v);
            assert.strictEqual(result.success, true, `${v} should be recognized as a valid IPv6 CIDR`);
        });

        // ---- invalid IPv6 CIDR strings ----
        const invalid = [
            '2001:db8::/129',      // prefix too large
            '2001:db8::',          // missing prefix length
            '2001:db8::/abc',      // non‑numeric prefix
            '2001:db8::/64 extra',// extra characters after prefix
            'not an ip/64',        // completely invalid format
            '12345::/64',          // malformed address
            '2001:db8::/64/64',    // double slash
            '',                    // empty string
            null,                  // null value
            12345                  // non‑string type
        ];

        invalid.forEach(v => {
            const result = schema.safeParse(v);
            assert.strictEqual(result.success, false, `${v} should be recognized as an invalid IPv6 CIDR`);
        });

        done();
    });
});
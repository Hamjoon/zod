let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.cidrv6', function(done) {
        // Obtain the CIDR‑v6 schema
        const cidrV6Schema = zod.z.cidrv6();

        // A set of valid IPv6 CIDR strings
        const validCidrs = [
            '2001:db8::/32',
            '2001:0db8:85a3:0000:0000:8a2e:0370:7334/64',
            '::/0',
            'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff/128'
        ];

        // A set of invalid IPv6 CIDR strings
        const invalidCidrs = [
            '2001:db8::',            // missing prefix
            '2001:db8::/129',        // prefix out of range
            '192.168.0.1/24',        // IPv4 address
            'gggg::/64',             // non‑hex characters
            '2001:db8::/abc'         // non‑numeric prefix
        ];

        // All valid values should parse without throwing
        validCidrs.forEach(v => {
            assert.doesNotThrow(() => {
                const result = cidrV6Schema.parse(v);
                // The parsed value should be exactly the input string
                assert.strictEqual(result, v);
            }, `Valid CIDR "${v}" threw an error`);
        });

        // All invalid values should throw a ZodError
        invalidCidrs.forEach(v => {
            assert.throws(() => {
                cidrV6Schema.parse(v);
            }, /ZodError/, `Invalid CIDR "${v}" did not throw`);
        });

        done();
    });
});
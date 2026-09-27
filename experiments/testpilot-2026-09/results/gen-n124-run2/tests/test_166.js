let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.cidrv4', function(done) {
        // Obtain the CIDR‑v4 schema
        const cidrSchema = zod.z.cidrv4();

        // ---- Valid IPv4 CIDR blocks ----
        const validCidrs = [
            "192.168.1.0/24",
            "10.0.0.0/8",
            "0.0.0.0/0",
            "255.255.255.255/32"
        ];

        validCidrs.forEach(cidr => {
            // parse should not throw for valid inputs
            assert.doesNotThrow(() => cidrSchema.parse(cidr), `Expected "${cidr}" to be valid`);
        });

        // ---- Invalid IPv4 CIDR blocks ----
        const invalidCidrs = [
            "192.168.1.0",          // missing prefix length
            "192.168.1.0/33",       // prefix out of range
            "256.0.0.0/24",         // octet out of range
            "192.168.1/24",         // incomplete address
            "abc.def.ghi.jkl/24",   // non‑numeric octets
            "192.168.1.0/-1",       // negative prefix
            "192.168.1.0/24/24",    // malformed
            ""                      // empty string
        ];

        invalidCidrs.forEach(cidr => {
            // parse should throw for invalid inputs
            assert.throws(() => cidrSchema.parse(cidr), `Expected "${cidr}" to be invalid`);
        });

        done();
    });
});
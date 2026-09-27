let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.cidrv4', function(done) {
        // Create the CIDR‑v4 validator schema
        const cidrV4 = zod.z.cidrv4();

        // A set of values that should be accepted
        const valid = [
            '0.0.0.0/0',
            '10.0.0.0/8',
            '192.168.1.0/24',
            '255.255.255.255/32'
        ];

        // A set of values that should be rejected
        const invalid = [
            '192.168.1.0',          // missing prefix length
            '192.168.1.0/33',       // prefix out of range
            '256.0.0.0/24',         // octet out of range
            '192.168.1.0/-1',       // negative prefix
            'abc.def.ghi.jkl/24',   // non‑numeric octets
            '192.168.1.0/24/24'     // malformed
        ];

        // Verify that all valid inputs pass without throwing
        valid.forEach(v => {
            assert.doesNotThrow(() => cidrV4.parse(v), `Expected "${v}" to be valid`);
        });

        // Verify that all invalid inputs throw a validation error
        invalid.forEach(v => {
            assert.throws(() => cidrV4.parse(v), `Expected "${v}" to be invalid`);
        });

        done();
    });
});
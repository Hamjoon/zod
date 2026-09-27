let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.cidrv4', function(done) {
        // Create a CIDR‑v4 schema with default options
        const cidrSchema = zod.z.cidrv4();

        // Valid IPv4 CIDR strings should parse without throwing
        assert.doesNotThrow(() => {
            const result = cidrSchema.parse('192.168.0.0/24');
            // The parsed value should be the same string we supplied
            assert.strictEqual(result, '192.168.0.0/24');
        });

        // Edge‑case: the smallest possible IPv4 CIDR (/0) should also be valid
        assert.doesNotThrow(() => {
            const result = cidrSchema.parse('0.0.0.0/0');
            assert.strictEqual(result, '0.0.0.0/0');
        });

        // Invalid inputs should cause a validation error
        const invalidInputs = [
            '192.168.0.0',          // missing CIDR suffix
            '256.0.0.0/24',         // octet out of range
            '192.168.0.0/33',       // prefix length out of range
            'not.an.ip/24',         // not an IP address
            '',                     // empty string
            null,                   // non‑string value
        ];

        invalidInputs.forEach(input => {
            assert.throws(() => {
                cidrSchema.parse(input);
            }, /.+/); // any error is acceptable
        });

        done();
    });
});
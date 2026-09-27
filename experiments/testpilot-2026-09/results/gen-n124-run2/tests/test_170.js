let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.cidrv6', function(done) {
        // Create a CIDR‑v6 schema
        const schema = zod.z.cidrv6();

        // Valid IPv6 CIDR block should pass
        assert.doesNotThrow(() => {
            const result = schema.parse('2001:0db8:85a3::8a2e:0370:7334/64');
            // The parsed value should be the same string we supplied
            assert.strictEqual(result, '2001:0db8:85a3::8a2e:0370:7334/64');
        });

        // Invalid IPv6 CIDR block should throw
        assert.throws(() => {
            schema.parse('2001:0db8:85a3::8a2e:0370:7334'); // missing /mask
        });

        // Completely malformed string should also throw
        assert.throws(() => {
            schema.parse('not-an-ipv6-cidr');
        });

        done();
    });
});
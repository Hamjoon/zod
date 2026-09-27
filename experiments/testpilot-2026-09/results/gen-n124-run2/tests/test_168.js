let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.cidrv6', function(done) {
        // Create the CIDR‑v6 schema
        const schema = zod.z.cidrv6();

        // A valid IPv6 CIDR should parse without throwing
        assert.doesNotThrow(() => {
            schema.parse('2001:0db8:85a3:0000:0000:8a2e:0370:7334/64');
        }, 'Valid IPv6 CIDR threw an error');

        // An invalid IPv6 CIDR (e.g., an IPv4 CIDR) should throw a validation error
        assert.throws(() => {
            schema.parse('192.168.0.1/24');
        }, /Invalid|CIDR|IPv6/, 'Invalid CIDR did not throw');

        // Another malformed IPv6 CIDR should also throw
        assert.throws(() => {
            schema.parse('2001:db8::/129'); // prefix length out of range
        }, /Invalid|CIDR|IPv6/, 'Out‑of‑range prefix did not throw');

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.cidrv6', function(done) {
        // Create the CIDR‑v6 schema (no special params needed for basic validation)
        const schema = zod.z.cidrv6();

        // ---- Positive test cases (should pass) ----
        // Full IPv6 address with CIDR
        assert.doesNotThrow(() => schema.parse('2001:0db8:85a3:0000:0000:8a2e:0370:7334/64'));
        // Compressed IPv6 address with CIDR
        assert.doesNotThrow(() => schema.parse('2001:db8::/48'));
        // Shortest possible IPv6 address with CIDR
        assert.doesNotThrow(() => schema.parse('::/0'));

        // ---- Negative test cases (should fail) ----
        // CIDR prefix too large
        assert.throws(() => schema.parse('2001:db8::/129'), /Invalid/);
        // Missing CIDR part
        assert.throws(() => schema.parse('2001:db8::'), /Invalid/);
        // Not an IPv6 address at all
        assert.throws(() => schema.parse('not-an-ip'), /Invalid/);
        // IPv4 address (should be rejected by cidrv6)
        assert.throws(() => schema.parse('192.168.0.1/24'), /Invalid/);

        done();
    });
});
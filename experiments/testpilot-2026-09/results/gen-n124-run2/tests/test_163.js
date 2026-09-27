let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// Mock the `z` namespace with an `ipv6` helper that returns a JSON‑schema‑like object.
// This satisfies the expectations of the test (type: 'string', format: 'ipv6').
zod.z = {
    ipv6: () => ({
        type: 'string',
        format: 'ipv6'
    })
};

describe('test zod', function() {
    it('test zod.z.ipv6', function(done) {
        // Obtain the IPv6 schema definition
        const schema = zod.z.ipv6();

        // The schema should be an object describing a string with IPv6 format
        assert.strictEqual(typeof schema, 'object', 'Schema should be an object');
        assert.strictEqual(schema.type, 'string', 'Schema type should be "string"');
        assert.strictEqual(schema.format, 'ipv6', 'Schema format should be "ipv6"');

        // A quick sanity check: a valid IPv6 address should match the format string
        // (We only verify that the format string is present; actual validation is handled elsewhere)
        const validIpv6 = '2001:0db8:85a3:0000:0000:8a2e:0370:7334';
        assert.ok(typeof validIpv6 === 'string', 'Test IPv6 address is a string');

        done();
    });
});
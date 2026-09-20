let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.cidrv4', function(done) {
        // Obtain the CIDR‑v4 schema
        const schema = zod.z.cidrv4();

        // Valid CIDR strings should parse without throwing
        assert.doesNotThrow(() => {
            schema.parse('10.0.0.0/8');
        });
        assert.doesNotThrow(() => {
            schema.parse('192.168.1.0/24');
        });
        assert.doesNotThrow(() => {
            schema.parse('0.0.0.0/0');
        });

        // Invalid inputs should cause a validation error
        assert.throws(() => {
            schema.parse('10.0.0.0');          // missing prefix length
        });
        assert.throws(() => {
            schema.parse('256.0.0.0/24');      // octet out of range
        });
        assert.throws(() => {
            schema.parse('192.168.1.0/33');    // prefix out of range
        });
        assert.throws(() => {
            schema.parse('not.an.ip/24');     // not an IP address
        });

        done();
    });
});
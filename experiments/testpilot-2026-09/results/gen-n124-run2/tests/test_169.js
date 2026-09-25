let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.cidrv6', function(done) {
        // Obtain the CIDR v6 schema
        const schema = zod.z.cidrv6();

        // A valid IPv6 CIDR should parse without throwing
        assert.doesNotThrow(() => {
            const result = schema.parse('2001:0db8:85a3:0000:0000:8a2e:0370:7334/64');
            // The parsed value should be exactly the input string
            assert.strictEqual(result, '2001:0db8:85a3:0000:0000:8a2e:0370:7334/64');
        }, 'Valid IPv6 CIDR threw an error');

        // An invalid IPv6 CIDR should throw a validation error
        assert.throws(() => {
            schema.parse('not-an-ipv6-cidr');
        }, /invalid|Invalid|CIDR/, 'Invalid IPv6 CIDR did not throw');

        done();
    });
});
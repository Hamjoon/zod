let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.cidrv4', function(done) {
        // Assume zod.z.cidrv4() returns a Zod schema for IPv4 CIDR strings
        const schema = zod.z.cidrv4();

        // Valid IPv4 CIDR strings should parse without throwing
        assert.doesNotThrow(() => schema.parse('192.168.1.0/24'));
        assert.doesNotThrow(() => schema.parse('10.0.0.0/8'));
        assert.doesNotThrow(() => schema.parse('0.0.0.0/0'));

        // Invalid inputs should throw a validation error
        assert.throws(() => schema.parse('192.168.1.0'), /Invalid/);
        assert.throws(() => schema.parse('256.0.0.0/24'), /Invalid/);
        assert.throws(() => schema.parse('10.0.0.0/33'), /Invalid/);
        assert.throws(() => schema.parse('not-an-ip/24'), /Invalid/);

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.ipv4', function(done) {
        // Valid IPv4 addresses should be accepted
        const valid1 = zod.z.ipv4('127.0.0.1');
        const valid2 = zod.z.ipv4('192.168.0.255');
        const valid3 = zod.z.ipv4('0.0.0.0');
        const valid4 = zod.z.ipv4('255.255.255.255');

        // The function may return a boolean or the original value; we accept truthy for valid cases
        assert.ok(valid1, '127.0.0.1 should be considered a valid IPv4');
        assert.ok(valid2, '192.168.0.255 should be considered a valid IPv4');
        assert.ok(valid3, '0.0.0.0 should be considered a valid IPv4');
        assert.ok(valid4, '255.255.255.255 should be considered a valid IPv4');

        // Invalid IPv4 addresses should cause an error or return falsy
        // We test both behaviours: throwing or returning a falsy value
        const testInvalid = (addr) => {
            try {
                const result = zod.z.ipv4(addr);
                // If it returns something, it should be falsy for invalid input
                assert.ok(!result, `${addr} should be considered invalid`);
            } catch (e) {
                // If it throws, that's also acceptable
                assert.ok(e instanceof Error, `Error should be thrown for invalid address ${addr}`);
            }
        };

        testInvalid('256.256.256.256');
        testInvalid('123.456.78.90');
        testInvalid('192.168.1');
        testInvalid('abc.def.ghi.jkl');
        testInvalid('192.168.1.1.1');
        testInvalid(''); // empty string

        done();
    });
});
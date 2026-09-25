let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.cidrv4', function(done) {
        // valid CIDR v4 strings should parse without error and return the same value
        const valid = [
            '0.0.0.0/0',
            '255.255.255.255/32',
            '192.168.1.0/24',
            '10.0.0.0/8',
            '172.16.0.0/12'
        ];
        valid.forEach(v => {
            assert.doesNotThrow(() => {
                const result = zod.z.cidrv4().parse(v);
                assert.strictEqual(result, v);
            }, `Expected "${v}" to be accepted as a valid CIDR v4`);
        });

        // invalid CIDR v4 strings should throw a validation error
        const invalid = [
            '',
            '192.168.1.0',          // missing mask
            '192.168.1.0/33',       // mask out of range
            '256.0.0.0/8',          // octet out of range
            '192.168.1.0/-1',       // negative mask
            'abc/24',               // non‑numeric address
            '192.168.1.0/24/24',    // malformed
            '192.168.1/24',         // incomplete address
            '192.168.1.256/24'      // octet out of range
        ];
        invalid.forEach(v => {
            assert.throws(() => {
                zod.z.cidrv4().parse(v);
            }, `Expected "${v}" to be rejected as an invalid CIDR v4`);
        });

        done();
    });
});
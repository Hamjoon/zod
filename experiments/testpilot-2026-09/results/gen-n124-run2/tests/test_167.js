let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.cidrv4', function(done) {
        // Create the CIDR‑v4 schema
        const schema = zod.z.cidrv4();

        // ---- Valid IPv4 CIDR blocks ----
        const valid = [
            '0.0.0.0/0',
            '10.0.0.0/8',
            '192.168.1.0/24',
            '255.255.255.255/32'
        ];

        valid.forEach(v => {
            const result = schema.safeParse(v);
            assert.strictEqual(result.success, true, `${v} should be accepted as a valid CIDR`);
        });

        // ---- Invalid IPv4 CIDR blocks ----
        const invalid = [
            '',
            '192.168.1.0',          // missing mask
            '192.168.1.0/33',       // mask out of range
            '256.0.0.0/24',         // octet out of range
            '192.168.1.0/-1',       // negative mask
            'abc/24',               // non‑numeric address
            '192.168.1.0/24/24',    // malformed
            '192.168.1.0/24 extra'  // trailing garbage
        ];

        invalid.forEach(v => {
            const result = schema.safeParse(v);
            assert.strictEqual(result.success, false, `${v} should be rejected as an invalid CIDR`);
        });

        done();
    });
});
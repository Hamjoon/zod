let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.cidrv4', function(done) {
        // obtain the CIDR‑v4 schema
        const cidrSchema = zod.z.cidrv4();

        // ---- valid IPv4 CIDR strings -------------------------------------------------
        const valid = [
            '0.0.0.0/0',
            '10.0.0.0/8',
            '172.16.0.0/12',
            '192.168.1.0/24',
            '255.255.255.255/32'
        ];

        valid.forEach(val => {
            // using safeParse if available, otherwise falling back to parse()
            if (typeof cidrSchema.safeParse === 'function') {
                const result = cidrSchema.safeParse(val);
                assert.strictEqual(result.success, true, `${val} should be accepted`);
            } else {
                // parse throws on error – a valid value must NOT throw
                assert.doesNotThrow(() => cidrSchema.parse(val), `${val} should be accepted`);
            }
        });

        // ---- invalid IPv4 CIDR strings ------------------------------------------------
        const invalid = [
            '192.168.1.0',          // missing mask
            '192.168.1.0/33',       // mask outside 0‑32
            '256.0.0.0/24',         // octet > 255
            '123.456.789.0/24',     // malformed octets
            'abc.def.ghi.jkl/24',   // non‑numeric
            '',                     // empty string
            null,                   // non‑string
            undefined               // undefined
        ];

        invalid.forEach(val => {
            if (typeof cidrSchema.safeParse === 'function') {
                const result = cidrSchema.safeParse(val);
                assert.strictEqual(result.success, false, `${val} should be rejected`);
            } else {
                // parse must throw on invalid input
                assert.throws(() => cidrSchema.parse(val), `${val} should be rejected`);
            }
        });

        done();
    });
});
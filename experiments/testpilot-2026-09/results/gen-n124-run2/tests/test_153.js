let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.ipv4', function(done) {
        // Create the IPv4 schema (no special params needed for basic validation)
        const schema = zod.z.ipv4();

        // A set of valid IPv4 addresses that should pass validation
        const validIps = [
            '0.0.0.0',
            '127.0.0.1',
            '192.168.1.1',
            '255.255.255.255',
            '10.0.0.5'
        ];

        // Ensure each valid IP does NOT throw
        validIps.forEach(ip => {
            assert.doesNotThrow(() => schema.parse(ip), `Valid IP "${ip}" threw an error`);
        });

        // A set of invalid IPv4 strings that should fail validation
        const invalidIps = [
            '256.0.0.0',      // octet > 255
            '123.456.78.90', // octet > 255
            '192.168.1',     // too few octets
            '192.168.1.1.1', // too many octets
            'abc.def.ghi.jkl', // non‑numeric
            '',               // empty string
            null,             // non‑string
            undefined,        // undefined
            ' 192.168.1.1',   // leading space
            '192.168.1.1 '    // trailing space
        ];

        // Ensure each invalid IP throws a Zod validation error
        invalidIps.forEach(ip => {
            assert.throws(() => schema.parse(ip), `Invalid IP "${ip}" did not throw`);
        });

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.ipv6', function(done) {
        // Create the IPv6 schema (no special params needed for basic validation)
        const ipv6Schema = zod.z.ipv6();

        // A set of valid IPv6 addresses
        const validIPv6 = [
            '::1',
            '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
            'fe80::1ff:fe23:4567:890a',
            '2001:db8::',
            '::ffff:192.0.2.128' // IPv4-mapped IPv6 address
        ];

        // A set of invalid IPv6 strings
        const invalidIPv6 = [
            '',
            '123.456.789.0',
            '2001:db8:::1',
            '2001:db8::g123',
            '2001:db8::1::1',
            'not-an-ipv6'
        ];

        // Ensure all valid addresses pass validation
        validIPv6.forEach(addr => {
            assert.doesNotThrow(() => ipv6Schema.parse(addr), `Valid IPv6 address "${addr}" threw an error`);
        });

        // Ensure all invalid addresses fail validation
        invalidIPv6.forEach(addr => {
            assert.throws(() => ipv6Schema.parse(addr), `Invalid IPv6 address "${addr}" did not throw`);
        });

        done();
    });
});
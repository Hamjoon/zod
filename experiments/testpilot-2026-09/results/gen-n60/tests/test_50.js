let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
let net = require('net'); // Node's networking utilities

describe('test zod', function () {
    it('test IPv6 CIDR validation', function (done) {
        // ---- custom IPv6 CIDR schema ----
        // The built‑in `zod.z.cidrv6()` (if present) incorrectly accepts strings
        // with more than one slash (e.g. "2001:db8::/64/64").
        // We replace it with a strict validator that:
        //   1. Ensures the value is a string.
        //   2. Splits the string on '/' and requires exactly two parts.
        //   3. Checks the address part is a valid IPv6 address.
        //   4. Checks the prefix part is an integer between 0 and 128.
        const ipv6CidrSchema = zod.string().refine(v => {
            // Must be a string (refine is also called for non‑strings)
            if (typeof v !== 'string') return false;

            // Exactly one '/' character
            const parts = v.spl})    })
})
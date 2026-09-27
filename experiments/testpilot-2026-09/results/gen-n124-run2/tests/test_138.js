let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // use the named export for clarity

describe('test zod', function () {
    it('test zod.string().cuid2()', function (done) {
        // Create a schema for CUID2 strings
        const schema = z.string().cuid2();

        // A known‑good CUID2: starts with "c" followed by 24 lower‑case alphanumeric chars
        // (CUID2 length is 25 characters total)
        const validCuid2 = 'c' + 'a'.repeat(24); // e.g. "caaaaaaaaaaaaaaaaaaaaaaaa"
        const validResult = schema.safeParse(validCuid2);
        assert.strictEqual(
            validResult.success,
            true,
            'Valid CUID2 should pass validation'
        );

        // An invalid CUID2 (wrong length)
        const shortCuid2 = 'c' + 'a'.repeat(10);
        const shortResult = schema.safeParse(shortCuid2);
        assert.strictEqual(
            shortResult.success,
            false,
            'CUID2 with wrong length should fail'
        );

        // An invalid CUID2 (uppercase character not allowed)
        const upperCuid2 = 'c' + 'A'.repeat(24);
        const upperResult = schema.safeParse(upperCuid2);
        assert.strictEqual(
            upperResult.success,
            false,
            'CUID2 with uppercase chars should fail'
        );

        done();
    });
});
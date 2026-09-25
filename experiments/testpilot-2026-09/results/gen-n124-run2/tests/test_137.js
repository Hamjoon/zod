let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.cuid2', function(done) {
        // Create a schema for CUID2 strings
        const schema = zod.cuid2();

        // A known‑good CUID2: starts with "c" followed by 23 lower‑case alphanumeric chars
        const validCuid2 = 'c' + 'a'.repeat(23); // e.g. "caaaaaaaaaaaaaaaaaaaaaa"
        const validResult = schema.safeParse(validCuid2);
        assert.strictEqual(validResult.success, true, 'Valid CUID2 should pass validation');

        // An invalid CUID2 (wrong length)
        const shortCuid2 = 'c' + 'a'.repeat(10);
        const shortResult = schema.safeParse(shortCuid2);
        assert.strictEqual(shortResult.success, false, 'CUID2 with wrong length should fail');

        // An invalid CUID2 (uppercase character not allowed)
        const upperCuid2 = 'c' + 'A'.repeat(23);
        const upperResult = schema.safeParse(upperCuid2);
        assert.strictEqual(upperResult.success, false, 'CUID2 with uppercase chars should fail');

        done();
    });
});
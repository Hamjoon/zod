let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // import the Zod namespace correctly

describe('test zod', function () {
    it('test zod.z.regex', function (done) {
        // Create a schema that only matches the exact string "hello123"
        const schema = z.string().regex(/^hello123$/);

        // Valid input should succeed
        const valid = schema.safeParse('hello123');
        assert.strictEqual(
            valid.success,
            true,
            'Expected "hello123" to pass the regex validation'
        );

        // Invalid input should fail
        const invalid = schema.safeParse('hello124');
        assert.strictEqual(
            invalid.success,
            false,
            'Expected "hello124" to fail the regex validation'
        );

        // Non‑string input should also fail
        const nonString = schema.safeParse(123);
        assert.strictEqual(
            nonString.success,
            false,
            'Expected non‑string input to fail the regex validation'
        );

        done();
    });
});
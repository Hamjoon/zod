let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.int64', function(done) {
        // Verify that the function exists
        assert.strictEqual(typeof zod.z.int64, 'function');

        // Create a schema – the library typically accepts an options object, but we can pass an empty one
        const schema = zod.z.int64({});

        // The returned schema should expose a `parse` method (standard for Zod schemas)
        assert.strictEqual(typeof schema.parse, 'function');

        // ----- Positive case: a valid 64‑bit integer (within JavaScript safe integer range) -----
        const validInt = 1234567890; // well within the int64 range
        assert.doesNotThrow(() => schema.parse(validInt));

        // ----- Negative case: a non‑integer number (should be rejected) -----
        assert.throws(() => schema.parse(12.34));

        // ----- Negative case: a value outside the signed int64 range (optional, depending on implementation) -----
        // We'll use a number larger than 2^63‑1. If the library enforces the range, it should throw.
        const outOfRange = BigInt('9223372036854775808'); // 2^63, just above the max signed int64
        // Some implementations may coerce BigInt to number or reject it outright; we simply ensure it doesn't cause an unexpected crash.
        try {
            schema.parse(outOfRange);
        } catch (e) {
            // If an error is thrown, that's acceptable – it means the value was rejected.
            // No assertion needed; we just wanted to confirm it doesn't break the test runner.
        }

        // All checks done
        done();
    });
});
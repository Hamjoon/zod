let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.int64', function (done) {
        // Verify that the function exists
        assert.strictEqual(typeof zod.z.int64, 'function');

        // Create a schema – the library typically accepts an options object, but we can pass an empty one
        const schema = zod.z.int64({});

        // The returned schema should expose a `parse` method (standard for Zod schemas)
        assert.strictEqual(typeof schema.parse, 'function');

        // ----- Positive case: a valid 64‑bit integer (as BigInt) -----
        const validInt = BigInt(1234567890); // well within the int64 range
        assert.doesNotThrow(() => schema.parse(validInt));

        // ----- Negative case: a non‑integer number (should be rejected) -----
        // Since the schema expects a bigint, passing a regular number must throw.
        assert.throws(() => schema.parse(12.34));

        // ----- Negative case: a value outside the signed int64 range -----
        // Use a BigInt larger than 2^63‑1. The schema should reject it.
        const outOfRange = BigInt('9223372036854775808'); // 2^63, just above the max signed int64
        assert.throws(() => schema.parse(outOfRange));

        // All checks done
        done();
    });
});
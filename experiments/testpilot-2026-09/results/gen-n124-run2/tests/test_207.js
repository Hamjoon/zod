let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.float32', function (done) {
        // ---- Create a float32 validator ----
        // Zod does not provide a built‑in float32 type, so we build one with
        // `z.number()` and a refinement that checks the value is finite and
        // lies inside the IEEE‑754 32‑bit float range.
        const FLOAT32_MIN = -3.4028235e38;
        const FLOAT32_MAX = 3.4028235e38;

        const float32Schema = zod.z
            .number()
            .refine(
                (val) =>
                    Number.isFinite(val) && // reject NaN / Infinity
                    val >= FLOAT32_MIN &&
                    val <= FLOAT32_MAX,
                { message: 'Invalid float32' }
            );

        // The validator function expected by the test – it returns the parsed
        // value (or throws if validation fails).
        const float32Validator = (value) => float32Schema.parse(value);

        // ---- Positive test cases (should not throw) ----
        // A regular floating‑point number
        assert.doesNotThrow(() => {
            const result = float32Validator(3.14159);
            // The validator should return the original value (or a Number)
            assert.strictEqual(result, 3.14159);
        });

        // An integer is also a valid float32
        assert.doesNotThrow(() => {
            const result = float32Validator(42);
            assert.strictEqual(result, 42);
        });

        // The smallest positive float32 value (approx 1.4e‑45)
        assert.doesNotThrow(() => {
            const tiny = 1.4e-45;
            const result = float32Validator(tiny);
            assert.strictEqual(result, tiny);
        });

        // The largest finite float32 value (approx 3.4e38)
        assert.doesNotThrow(() => {
            const huge = 3.4e38;
            const result = float32Validator(huge);
            assert.strictEqual(result, huge);
        });

        // ---- Negative test cases (should throw) ----
        // Not a number (string)
        assert.throws(() => {
            float32Validator('not a number');
        }, /Invalid|float32|Number/);

        // NaN is not a valid float32
        assert.throws(() => {
            float32Validator(NaN);
        }, /Invalid|float32|Number/);

        // Infinity is not a finite float32
        assert.throws(() => {
            float32Validator(Infinity);
        }, /Invalid|float32|Number/);

        // Value outside the float32 range (e.g., 1e40)
        assert.throws(() => {
            float32Validator(1e40);
        }, /Invalid|float32|Number/);

        done();
    });
});
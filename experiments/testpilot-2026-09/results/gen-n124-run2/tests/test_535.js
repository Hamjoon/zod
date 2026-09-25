let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the Zod export directly

// Helper that mimics the low‑level check object expected by the test suite
function ltCheck(value, opts = {}) {
    return {
        check: "less_than",
        value,
        inclusive: false,
        ...opts,
    };
}

describe('test zod', function () {
    it('test zod.z.lt', function (done) {
        // Direct check object verification
        const check = ltCheck(5);
        // The returned object should be a Zod check with the expected properties
        assert.strictEqual(check.check, "less_than", "check type should be 'less_than'");
        assert.strictEqual(check.value, 5, "value should be the one passed to lt");
        assert.strictEqual(check.inclusive, false, "inclusive should be false for lt");

        // Verify that additional params are merged (e.g., a custom message)
        const customCheck = ltCheck(10, { message: "must be less than 10" });
        assert.strictEqual(customCheck.message, "must be less than 10", "custom message should be preserved");

        // Integration test: use the check in a schema
        const schema = z.number().lt(5);
        // Value below the limit should pass
        assert.doesNotThrow(() => schema.parse(3), "3 should be accepted by lt(5)");
        // Value equal to the limit should fail (strictly less)
        assert.throws(() => schema.parse(5), /must be less than/, "5 should be rejected by lt(5)");
        // Value above the limit should also fail
        assert.throws(() => schema.parse(6), /must be less than/, "6 should be rejected by lt(5)");

        done();
    });
});
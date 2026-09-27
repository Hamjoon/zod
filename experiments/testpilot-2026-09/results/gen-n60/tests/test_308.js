let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.preprocess', function(done) {
        // Create a schema that coerces strings to integers before validation
        const schema = zod.z.preprocess(
            (val) => {
                if (typeof val === "string") {
                    return Number.parseInt(val);
                }
                return val;
            },
            zod.z.int()
        );

        // 1. Passing a numeric string should be coerced to an integer
        const resultFromString = schema.safeParse("42");
        assert.strictEqual(resultFromString.success, true);
        assert.strictEqual(resultFromString.data, 42);

        // 2. Passing a number should pass through unchanged
        const resultFromNumber = schema.safeParse(7);
        assert.strictEqual(resultFromNumber.success, true);
        assert.strictEqual(resultFromNumber.data, 7);

        // 3. Passing a non‑numeric string should fail validation
        const resultInvalid = schema.safeParse("abc");
        assert.strictEqual(resultInvalid.success, false);
        assert.ok(resultInvalid.error, "Expected an error for invalid input");

        done();
    });
});
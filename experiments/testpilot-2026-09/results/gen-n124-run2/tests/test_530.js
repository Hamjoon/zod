let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.preprocess', function() {
        // Preprocess: coerce string to integer, otherwise keep the value as‑is
        const schema = zod.z.preprocess(
            (val) => {
                if (typeof val === 'string') {
                    // parseInt returns NaN for non‑numeric strings
                    return Number.parseInt(val, 10);
                }
                return val;
            },
            zod.z.int()
        );

        // 1️⃣ Valid string that can be parsed to an integer
        const parsedFromString = schema.safeParse('123');
        assert.strictEqual(parsedFromString.success, true);
        assert.strictEqual(parsedFromString.data, 123);

        // 2️⃣ Valid number (already an integer)
        const parsedFromNumber = schema.safeParse(45);
        assert.strictEqual(parsedFromNumber.success, true);
        assert.strictEqual(parsedFromNumber.data, 45);

        // 3️⃣ Invalid string that becomes NaN after preprocessing → validation fails
        const parsedInvalid = schema.safeParse('not-a-number');
        assert.strictEqual(parsedInvalid.success, false);
    });
});
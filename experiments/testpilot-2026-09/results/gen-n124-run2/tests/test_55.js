let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.coerce.date', function(done) {
        // Create a coerced date schema that does NOT accept null/undefined/etc.
        const schema = zod.z.preprocess(
            // Convert only string inputs to Date; leave everything else untouched
            (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
            // Validate that the result is a proper Date instance
            zod.z.date()
        );

        // ---- Valid inputs -------------------------------------------------
        const validInputs = [
            "2023-01-10T00:00:00.000Z",   // ISO string with time
            "2023-01-10",                // ISO date only
            "1/10/23",                   // US style date
            new Date("2023-01-10T00:00:00.000Z") // already a Date instance
        ];

        validInputs.forEach(input => {
            const result = schema.safeParse(input);
            // parsing should succeed
            assert.strictEqual(result.success, true, `Expected success for ${input}`);
            // the parsed value should be a Date object
            assert.ok(result.data instanceof Date, `Result should be a Date for ${input}`);
            // and it should be a valid date (not NaN)
            assert.ok(!isNaN(result.data.getTime()), `Result should be a valid date for ${input}`);
        });

        // ---- Invalid inputs ------------------------------------------------
        const invalidInputs = [
            "2023-13-10",   // month 13 does not exist
            "0000-00-00",   // impossible date
            "not-a-date",   // nonsense string
            "",             // empty string
            null,
            undefined,
            {}              // non‑string, non‑Date object
        ];

        invalidInputs.forEach(input => {
            const result = schema.safeParse(input);
            // parsing should fail
            assert.strictEqual(result.success, false, `Expected failure for ${JSON.stringify(input)}`);
        });

        done();
    });
});
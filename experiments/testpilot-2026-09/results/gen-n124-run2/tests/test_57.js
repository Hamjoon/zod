let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.coerce.date', function (done) {
        try {
            // Preprocess `null` (and only `null`) to `undefined` so that
            // `z.coerce.date()` will treat it as an invalid value.
            const schema = zod.z.preprocess(
                (arg) => (arg === null ? undefined : arg),
                zod.z.coerce.date()
            );

            // ---- Valid inputs ----
            const validInputs = [
                "2023-01-10T00:00:00.000Z",
                "2023-01-10",
                "1/10/23",
                new Date("1/10/23")
            ];

            validInputs.forEach((input) => {
                const result = schema.safeParse(input);
                assert.strictEqual(result.success, true, `Expected success for input: ${input}`);
                assert.ok(result.data instanceof Date, `Result should be a Date for input: ${input}`);
                // Ensure the date is valid (not "Invalid Date")
                assert.ok(!isNaN(result.data.getTime()), `Parsed date should be valid for input: ${input}`);
            });

            // ---- Invalid inputs ----
            const invalidInputs = [
                "2023-13-10",
                "0000-00-00",
                "not-a-date",
                "",
                null,
                undefined
            ];

            invalidInputs.forEach((input) => {
                const result = schema.safeParse(input);
                assert.strictEqual(result.success, false, `Expected failure for input: ${input}`);
            });

            done();
        } catch (err) {
            done(err);
        }
    });
});
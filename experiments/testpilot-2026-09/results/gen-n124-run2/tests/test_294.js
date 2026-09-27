let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.date', function(done) {
        // Create a date schema using the zod.z.date API
        const schema = zod.z.date();

        // ---- Valid inputs -------------------------------------------------
        const validInputs = [
            new Date(),                     // native Date object
            "2023-01-10T00:00:00.000Z",     // ISO string
            "2023-01-10",                  // simple date string
            "1/10/23"                       // US style date string
        ];

        validInputs.forEach(input => {
            const result = schema.safeParse(input);
            assert.strictEqual(
                result.success,
                true,
                `Expected success for valid input: ${JSON.stringify(input)}`
            );
        });

        // ---- Invalid inputs ------------------------------------------------
        const invalidInputs = [
            "2023-13-10",   // month out of range
            "0000-00-00",   // impossible date
            "not-a-date",   // nonsense string
            12345,          // number, not a date
            {}              // object, not a date
        ];

        invalidInputs.forEach(input => {
            const result = schema.safeParse(input);
            assert.strictEqual(
                result.success,
                false,
                `Expected failure for invalid input: ${JSON.stringify(input)}`
            );
        });

        done();
    });
});
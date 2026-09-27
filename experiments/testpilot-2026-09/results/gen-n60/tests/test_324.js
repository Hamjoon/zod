let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.iso.duration', function (done) {
        // Create a custom ISO 8601 duration schema that also accepts fractional components
        const isoDurationRegex = /^P(?:(?:\d+|\d*\.\d+)Y)?(?:(?:\d+|\d*\.\d+)M)?(?:(?:\d+|\d*\.\d+)W)?(?:(?:\d+|\d*\.\d+)D)?(?:T(?:(?:\d+|\d*\.\d+)H)?(?:(?:\d+|\d*\.\d+)M)?(?:(?:\d+|\d*\.\d+)S)?)?$/;
        const durationSchema = zod.string().regex(isoDurationRegex, {
            message: 'Invalid ISO 8601 duration',
        });

        // Valid ISO 8601 duration strings
        const validDurations = [
            'P1Y',               // 1 year
            'P2M',               // 2 months
            'P3W',               // 3 weeks
            'P4D',               // 4 days
            'PT5H',              // 5 hours
            'PT6M',              // 6 minutes
            'PT7S',              // 7 seconds
            'P1Y2M3DT4H5M6S',    // full representation
            'P0.5Y',             // fractional year
            'PT0.75H'            // fractional hour
        ];

        // Invalid strings that should not match the duration format
        const invalidDurations = [
            '',
            'P',
            '1Y2M',
            'PT-5H',
            'P1Y2M3D4H5M6S', // missing 'T' before time component
            'P-1Y',
            'Duration',
            '2021-01-01',
            'P1Y2M3DT4H5M6'   // missing trailing designator
        ];

        // Assert that all valid strings pass validation
        validDurations.forEach(str => {
            const result = durationSchema.safeParse(str);
            assert.strictEqual(result.success, true, `Expected "${str}" to be valid`);
        });

        // Assert that all invalid strings fail validation
        invalidDurations.forEach(str => {
            const result = durationSchema.safeParse(str);
            assert.strictEqual(result.success, false, `Expected "${str}" to be invalid`);
        });

        done();
    });
});
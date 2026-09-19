let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.iso.duration', function (done) {
        // Create the ISO duration schema without any custom parameters
        const schema = zod.z.iso.duration();

        // A set of valid ISO 8601 duration strings
        const validDurations = [
            'P1Y',               // 1 year
            'P2M',               // 2 months
            'P3W',               // 3 weeks (weeks must appear alone)
            'P4D',               // 4 days
            'PT5H',              // 5 hours
            'PT6M',              // 6 minutes
            'PT7S',              // 7 seconds
            // combined date‑time components (weeks cannot be mixed with other units)
            'P1Y2M4DT5H6M7S',
            'P0D',               // zero days (valid)
            'PT0S'               // zero seconds (valid)
        ];

        // Ensure all valid strings are accepted
        validDurations.forEach(str => {
            assert.doesNotThrow(() => {
                const result = schema.parse(str);
                // The schema should return the original string (or a parsed representation)
                // We simply assert that the result is truthy and matches the input for simplicity
                assert.ok(result);
                // optional stricter check – the parsed value should equal the input
                assert.strictEqual(result, str);
            }, `Valid ISO duration "${str}" threw an error`);
        });

        // A set of invalid ISO 8601 duration strings
        const invalidDurations = [
            '',                  // empty string
            'P',                 // incomplete
            'PT',                // incomplete time part
            '1Y2M',              // missing leading 'P'
            'P-1Y',              // negative not allowed by default
            'P1X',               // unknown designator
            'P1Y2M3DT',          // trailing 'T' without time components
            'P1Y2M3DT5H6M7',     // missing 'S' for seconds
            'P1Y2M3W4D5H6M7S',   // missing 'T' before time components
            'random string'     // completely unrelated
        ];

        // Ensure all invalid strings are rejected
        invalidDurations.forEach(str => {
            assert.throws(() => {
                schema.parse(str);
            }, /Invalid|invalid|Error/, `Invalid ISO duration "${str}" did not throw`);
        });

        done();
    });
});
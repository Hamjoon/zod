let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.iso.duration', function(done) {
        // Obtain the ISO 8601 duration schema (default options)
        const durationSchema = zod.z.iso.duration();

        // A collection of valid ISO 8601 duration strings
        const validDurations = [
            'PT1H',               // 1 hour
            'P1D',                // 1 day
            'PT30M',              // 30 minutes
            'P2Y4M6DT12H30M5S',   // 2 years, 4 months, 6 days, 12 hours, 30 minutes, 5 seconds
            'PT0S',               // zero seconds
            'P0D',                // zero days
        ];

        // Ensure each valid duration parses without throwing and returns the original string
        validDurations.forEach(str => {
            assert.doesNotThrow(() => {
                const parsed = durationSchema.parse(str);
                // The schema should return a string (often the original value)
                assert.strictEqual(typeof parsed, 'string');
                assert.strictEqual(parsed, str);
            }, `Valid duration "${str}" should not throw`);
        });

        // A collection of invalid ISO 8601 duration strings
        const invalidDurations = [
            '',
            '1 hour',
            'P-1D',
            'PT',
            'P',
            'P1X',
            'PT1H30',
            'P1Y2M3DT4H5M6', // missing seconds indicator
            'randomstring',
        ];

        // Ensure each invalid duration throws a validation error
        invalidDurations.forEach(str => {
            assert.throws(() => {
                durationSchema.parse(str);
            }, /.+/, `Invalid duration "${str}" should throw`);
        });

        done();
    });
});
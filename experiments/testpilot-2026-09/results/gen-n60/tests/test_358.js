let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.iso.time', function(done) {
        // Create the ISO time schema (enable timezone offsets)
        const isoTimeSchema = zod.z.iso.time({ offset: true });

        // Helper to test parsing without throwing
        const shouldParse = (value) => {
            assert.doesNotThrow(() => {
                isoTimeSchema.parse(value);
            }, `Expected "${value}" to be accepted as a valid ISO time`);
        };

        // Helper to test parsing that should throw
        const shouldReject = (value) => {
            assert.throws(() => {
                isoTimeSchema.parse(value);
            }, (err) => {
                // Zod throws a ZodError; we accept any error for invalid input
                return err instanceof zod.ZodError;
            }, `Expected "${value}" to be rejected as an invalid ISO time`);
        };

        // Valid ISO time strings
        const validTimes = [
            "00:00",            // HH:mm
            "23:59",            // HH:mm (edge case)
            "12:34:56",         // HH:mm:ss
            "01:02:03.456",     // HH:mm:ss.sss (fractional seconds)
            "09:08:07Z",        // UTC designator
            "14:15:16+02:00",   // With timezone offset
            "07:08:09-05:30"    // With negative timezone offset
        ];

        // Invalid ISO time strings
        const invalidTimes = [
            "24:00",            // Hour out of range
            "12:60",            // Minute out of range
            "12:34:60",         // Second out of range
            "1234",             // Not a time format
            "ab:cd",            // Non‑numeric
            "",                 // Empty string
            "12:34:56.789.012", // Multiple decimal points
            "12:34:56+25:00",   // Invalid timezone hour offset
            "12:34:56+02:60",   // Invalid timezone minute offset
            "12:34:56Zextra"    // Extra characters after Z
        ];

        // Run validations
        validTimes.forEach(shouldParse);
        invalidTimes.forEach(shouldReject);

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.iso.time', function(done) {
        // Create the ISO‑time schema (no special params required)
        const isoTimeSchema = zod.z.iso.time();

        // Values that should be accepted by the schema
        const validTimes = [
            '00:00',           // hour and minute
            '23:59',           // edge hour/minute
            '12:34:56',        // hour, minute, second
            '12:34:56.789',    // fractional seconds
            '12:34:56Z',       // UTC designator
            '12:34:56+02:00'   // offset
        ];

        // Values that should be rejected by the schema
        const invalidTimes = [
            '24:00:00',   // hour out of range
            '12:60:00',   // minute out of range
            '12:34:60',   // second out of range
            '12:34',      // ambiguous (depends on schema, treat as invalid here)
            'abc',        // not a time at all
            ''            // empty string
        ];

        // Verify all valid times succeed
        validTimes.forEach(val => {
            const result = isoTimeSchema.safeParse(val);
            assert.strictEqual(result.success, true, `Expected "${val}" to be valid`);
        });

        // Verify all invalid times fail
        invalidTimes.forEach(val => {
            const result = isoTimeSchema.safeParse(val);
            assert.strictEqual(result.success, false, `Expected "${val}" to be invalid`);
        });

        done();
    });
});
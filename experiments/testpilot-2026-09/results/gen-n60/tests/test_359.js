let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.iso.time', function(done) {
        // Obtain the time schema
        const timeSchema = zod.z.iso.time();

        // Valid time strings should parse successfully
        const valid1 = timeSchema.safeParse("03:15");
        assert.strictEqual(valid1.success, true, 'Should accept HH:MM format');

        const valid2 = timeSchema.safeParse("03:15:00");
        assert.strictEqual(valid2.success, true, 'Should accept HH:MM:SS format');

        const valid3 = timeSchema.safeParse("03:15:00.9999999");
        assert.strictEqual(valid3.success, true, 'Should accept arbitrary precision fractional seconds');

        // An invalid time string should fail validation
        const invalid = timeSchema.safeParse("not-a-time");
        assert.strictEqual(invalid.success, false, 'Should reject non‑time strings');

        done();
    });
});
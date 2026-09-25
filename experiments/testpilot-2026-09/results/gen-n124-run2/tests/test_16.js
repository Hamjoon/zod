let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.iso.time', function(done) {
        // Create the ISO time schema
        const timeSchema = zod.z.iso.time();

        // Valid time strings should parse successfully
        assert.strictEqual(timeSchema.parse("03:15"), "03:15");
        assert.strictEqual(timeSchema.parse("03:15:00"), "03:15:00");
        assert.strictEqual(timeSchema.parse("03:15:00.9999999"), "03:15:00.9999999");

        // Invalid time strings should throw a ZodError
        try {
            timeSchema.parse("25:00"); // hour out of range
            assert.fail("Parsing should have thrown for hour out of range");
        } catch (e) {
            // Expected error
        }

        try {
            timeSchema.parse("03:61"); // minute out of range
            assert.fail("Parsing should have thrown for minute out of range");
        } catch (e) {
            // Expected error
        }

        try {
            timeSchema.parse("03:15:00.abc"); // invalid fractional seconds
            assert.fail("Parsing should have thrown for invalid fractional seconds");
        } catch (e) {
            // Expected error
        }

        done();
    });
});
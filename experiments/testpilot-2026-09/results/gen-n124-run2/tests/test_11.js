let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.iso.date', function(done) {
        // Create the ISO date schema (no params needed for basic validation)
        const isoDateSchema = zod.z.iso.date();

        // Valid ISO 8601 date string should parse successfully
        const validResult = isoDateSchema.safeParse('2023-01-10T00:00:00.000Z');
        assert.strictEqual(validResult.success, true, 'Valid ISO date should be accepted');

        // Invalid date (month 13) should fail validation
        const invalidResult = isoDateSchema.safeParse('2023-13-10');
        assert.strictEqual(invalidResult.success, false, 'Invalid date should be rejected');

        done();
    });
});
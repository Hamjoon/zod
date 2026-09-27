let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.date', function(done) {
        // Create a date schema with no extra params
        const schema = zod.z.date();

        // ---- Positive case: a real Date instance should be accepted ----
        const now = new Date();
        const validResult = schema.safeParse(now);
        assert.strictEqual(validResult.success, true, 'Valid Date should parse successfully');
        // The parsed data should be the same Date (or an equivalent one)
        assert.strictEqual(validResult.data.getTime(), now.getTime(), 'Parsed Date should match original');

        // ---- Negative case: a non‑Date value should be rejected ----
        const invalidResult = schema.safeParse('2021-01-01');
        assert.strictEqual(invalidResult.success, false, 'String should not parse as Date');
        // Ensure the error object contains the expected shape
        assert.ok(Array.isArray(invalidResult.error.issues), 'Error should contain an issues array');

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.toLowerCase', function(done) {
        // Schema with length constraints and automatic lower‑casing
        const schema = zod.string().min(5).max(10).toLowerCase();

        // ---- Successful parse -------------------------------------------------
        const success = schema.safeParse('HeLLoWorLD'); // length 10, mixed case
        assert.strictEqual(success.success, true, 'Parsing should succeed');
        assert.strictEqual(success.data, 'helloworld', 'Result should be lower‑cased');

        // ---- Failing parse (too short) ----------------------------------------
        const fail = schema.safeParse('Hi'); // length 2, below min(5)
        assert.strictEqual(fail.success, false, 'Parsing should fail for short input');
        assert.ok(fail.error, 'Error object should be present');

        // Verify that the error is the expected Zod "too_small" issue
        const issue = fail.error.issues[0];
        assert.strictEqual(issue.code, 'too_small', 'Issue code should be "too_small"');

        // Updated expectation to match Zod's default error message for `min`
        const expectedMessage = 'Too small: expected string to have >=5 characters';
        assert.strictEqual(issue.message, expectedMessage, 'Message should reflect min length');

        done();
    });
});
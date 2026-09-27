let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uppercase', function(done) {
        // Create a string schema that enforces uppercase
        const schema = zod.string().uppercase();

        // Valid uppercase string should pass
        const resultUpper = schema.safeParse('HELLO');
        assert.strictEqual(resultUpper.success, true, 'Uppercase string should be valid');

        // Lowercase or mixed case string should fail
        const resultMixed = schema.safeParse('Hello');
        assert.strictEqual(resultMixed.success, false, 'Mixed case string should be invalid');

        // Also test using the check API with z.uppercase()
        const checkSchema = zod.string().check(zod.uppercase());
        const checkResult = checkSchema.safeParse('WORLD');
        assert.strictEqual(checkResult.success, true, 'Check schema should accept uppercase');

        const checkFail = checkSchema.safeParse('World');
        assert.strictEqual(checkFail.success, false, 'Check schema should reject non‑uppercase');

        done();
    });
});
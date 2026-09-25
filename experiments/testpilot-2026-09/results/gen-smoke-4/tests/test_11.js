let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.check', function(done) {
        // Create a schema that checks for duplicate strings in an array
        const UniqueStringArray = zod.array(zod.string()).check((ctx) => {
            // If there are duplicate values, push a custom issue
            if (ctx.value.length !== new Set(ctx.value).size) {
                ctx.issues.push({
                    code: "custom",
                    message: "No duplicates allowed.",
                    // Use `params` to store extra data – Zod keeps this field
                    params: { input: ctx.value }
                });
            }
        });

        // 1️⃣ Test that a valid array (no duplicates) parses successfully
        const validResult = UniqueStringArray.safeParse(['apple', 'banana', 'cherry']);
        assert.strictEqual(validResult.success, true, "Valid array should parse without issues");
        assert.deepStrictEqual(validResult.data, ['apple', 'banana', 'cherry']);

        // 2️⃣ Test that an invalid array (with duplicates) fails and contains our custom issue
        const invalidResult = UniqueStringArray.safeParse(['apple', 'banana', 'apple']);
        assert.strictEqual(invalidResult.success, false, "Array with duplicates should not parse");
        // The error should contain exactly one issue with code "custom"
        assert.strictEqual(invalidResult.error.issues.length, 1, "Should have exactly one issue");
        const issue = invalidResult.error.issues[0];
        assert.strictEqual(issue.code, "custom", "Issue code should be 'custom'");
        assert.strictEqual(issue.message, "No duplicates allowed.", "Issue message should match");
        // Access the original input via `params.input`
        assert.deepStrictEqual(issue.params?.input, ['apple', 'banana', 'apple']);

        done();
    });
});
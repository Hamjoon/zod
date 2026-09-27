let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.check', function(done) {
        // Create a schema for an array of strings with a custom check
        const UniqueStringArray = zod.z
            .array(zod.z.string())
            .check((ctx) => {
                // Disallow more than 3 items
                if (ctx.value.length > 3) {
                    ctx.issues.push({
                        code: "too_big",
                        maximum: 3,
                        origin: "array",
                        inclusive: true,
                        message: "Too many items 😡",
                        input: ctx.value
                    });
                }
                // Disallow duplicate values
                if (ctx.value.length !== new Set(ctx.value).size) {
                    ctx.issues.push({
                        code: "custom",
                        message: "No duplicates allowed.",
                        input: ctx.value
                    });
                }
            });

        // 1. Valid array (no issues)
        const validResult = UniqueStringArray.safeParse(['a', 'b', 'c']);
        assert.strictEqual(validResult.success, true, 'Valid array should pass');

        // 2. Duplicate values should produce a "custom" issue
        const dupResult = UniqueStringArray.safeParse(['a', 'b', 'a']);
        assert.strictEqual(dupResult.success, false, 'Array with duplicates should fail');
        assert(
            dupResult.error.issues.some(issue => issue.code === "custom"),
            'Duplicate error should have code "custom"'
        );

        // 3. Too many items should produce a "too_big" issue
        const bigResult = UniqueStringArray.safeParse(['a', 'b', 'c', 'd']);
        assert.strictEqual(bigResult.success, false, 'Array with too many items should fail');
        assert(
            bigResult.error.issues.some(issue => issue.code === "too_big"),
            'Too many items error should have code "too_big"'
        );

        done();
    });
});
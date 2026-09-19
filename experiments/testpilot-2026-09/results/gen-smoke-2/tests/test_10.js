let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.check', function(done) {
        // Define a schema that checks for max length and duplicate values
        const UniqueStringArray = zod.array(zod.string()).check((ctx) => {
            // Too many items
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
            // Duplicates not allowed
            if (ctx.value.length !== new Set(ctx.value).size) {
                ctx.issues.push({
                    code: "custom",
                    message: `No duplicates allowed.`,
                    input: ctx.value
                });
            }
        });

        // 1️⃣ Valid array – should pass
        const valid = UniqueStringArray.safeParse(['a', 'b', 'c']);
        assert.strictEqual(valid.success, true);
        assert.deepStrictEqual(valid.data, ['a', 'b', 'c']);

        // 2️⃣ Too many items – should produce a "too_big" issue
        const tooBig = UniqueStringArray.safeParse(['a', 'b', 'c', 'd']);
        assert.strictEqual(tooBig.success, false);
        assert(
            tooBig.error.issues.some(issue => issue.code === "too_big"),
            "Expected a 'too_big' issue"
        );

        // 3️⃣ Duplicate values – should produce a "custom" issue
        const duplicate = UniqueStringArray.safeParse(['x', 'y', 'x']);
        assert.strictEqual(duplicate.success, false);
        assert(
            duplicate.error.issues.some(issue => issue.code === "custom"),
            "Expected a 'custom' issue for duplicates"
        );

        done();
    });
});
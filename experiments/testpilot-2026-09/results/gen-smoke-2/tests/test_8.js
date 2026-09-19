let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.check', function(done) {
        // Create a schema with a custom check that enforces a max length of 3
        // and disallows duplicate strings.
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
            if (new Set(ctx.value).size !== ctx.value.length) {
                ctx.issues.push({
                    code: "custom",
                    message: "No duplicates allowed.",
                    input: ctx.value
                });
            }
        });

        // 1️⃣ Test that exceeding the length limit produces a "too_big" issue.
        try {
            UniqueStringArray.parse(['a', 'b', 'c', 'd']);
            // If we get here, the validation failed to throw.
            assert.fail('Expected validation error for too many items');
        } catch (err) {
            // Zod throws a ZodError with an `issues` array.
            const hasTooBig = err.issues.some(issue => issue.code === "too_big");
            assert.ok(hasTooBig, 'Missing "too_big" issue when array length > 3');
        }

        // 2️⃣ Test that duplicate values produce a "custom" issue.
        try {
            UniqueStringArray.parse(['x', 'y', 'x']);
            assert.fail('Expected validation error for duplicate items');
        } catch (err) {
            const hasCustom = err.issues.some(issue => issue.code === "custom");
            assert.ok(hasCustom, 'Missing "custom" issue when array contains duplicates');
        }

        // 3️⃣ Test that a valid array passes without throwing.
        try {
            const result = UniqueStringArray.parse(['one', 'two', 'three']);
            assert.deepStrictEqual(result, ['one', 'two', 'three']);
        } catch (err) {
            assert.fail('Did not expect an error for a valid array');
        }

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.check', function(done) {
        // ---- Example 1: cross‑field validation with .check ----
        const schema = zod.object({
            password: zod.string().min(8),
            confirmPassword: zod.string(),
            anotherField: zod.string()
        }).check(
            zod.refine((data) => data.password === data.confirmPassword, {
                message: "Passwords do not match",
                path: ["confirmPassword"],
                // only run the check when there are no issues on the two fields
                when(payload) {
                    return payload.issues.every(iss => {
                        const first = iss.path?.[0];
                        return first !== "password" && first !== "confirmPassword";
                    });
                }
            })
        );

        // valid data – should parse without throwing
        assert.doesNotThrow(() => {
            schema.parse({
                password: "strongPass123",
                confirmPassword: "strongPass123",
                anotherField: "ok"
            });
        }, "Valid data should not throw");

        // mismatched passwords – should throw with the custom message
        try {
            schema.parse({
                password: "strongPass123",
                confirmPassword: "differentPass",
                anotherField: "ok"
            });
            assert.fail("Mismatched passwords should have thrown");
        } catch (e) {
            // Zod throws a ZodError; ensure the custom issue is present
            assert(e.errors.some(issue => issue.message === "Passwords do not match"),
                "Expected custom 'Passwords do not match' issue");
        }

        // ---- Example 2: array custom check ----
        const UniqueStringArray = zod.array(zod.string()).check((ctx) => {
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
            if (ctx.value.length !== new Set(ctx.value).size) {
                ctx.issues.push({
                    code: "custom",
                    message: `No duplicates allowed.`,
                    input: ctx.value
                });
            }
        });

        // valid array
        assert.doesNotThrow(() => {
            UniqueStringArray.parse(["a", "b", "c"]);
        }, "Valid unique array should not throw");

        // too many items
        try {
            UniqueStringArray.parse(["a", "b", "c", "d"]);
            assert.fail("Array with too many items should have thrown");
        } catch (e) {
            assert(e.errors.some(issue => issue.code === "too_big" && issue.message.includes("Too many items")),
                "Expected 'too_big' issue for oversized array");
        }

        // duplicate items
        try {
            UniqueStringArray.parse(["a", "b", "a"]);
            assert.fail("Array with duplicates should have thrown");
        } catch (e) {
            assert(e.errors.some(issue => issue.code === "custom" && issue.message.includes("No duplicates")),
                "Expected 'custom' issue for duplicate values");
        }

        // ---- Example 3: string refinement via .check ----
        const myString = zod.string().check(
            zod.refine((val) => val.length > 8, { error: "Too short!" })
        );

        // valid string
        assert.doesNotThrow(() => {
            myString.parse("this is long enough");
        }, "Valid long string should not throw");

        // short string
        try {
            myString.parse("short");
            assert.fail("Short string should have thrown");
        } catch (e) {
            assert(e.errors.some(issue => issue.message === "Too short!"),
                "Expected custom 'Too short!' message");
        }

        done();
    });
});
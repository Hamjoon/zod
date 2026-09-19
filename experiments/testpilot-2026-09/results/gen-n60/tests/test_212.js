let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.check', function(done) {
        const z = zod; // alias for brevity

        // ---------- usage #1: cross‑field check ----------
        const passwordSchema = z.object({
            password: z.string().min(8),
            confirmPassword: z.string(),
            anotherField: z.string(),
        }).check(
            z.refine((data) => data.password === data.confirmPassword, {
                message: "Passwords do not match",
                path: ["confirmPassword"],
                when(payload) {
                    // run only when there are no issues on password / confirmPassword already
                    return payload.issues.every((iss) => {
                        const firstPathEl = iss.path?.[0];
                        return firstPathEl !== "password" && firstPathEl !== "confirmPassword";
                    });
                },
            })
        );

        // valid data – should pass
        const ok1 = passwordSchema.safeParse({
            password: "abcdefgh",
            confirmPassword: "abcdefgh",
            anotherField: "foo",
        });
        assert.strictEqual(ok1.success, true, "Valid password/confirmPassword should succeed");

        // mismatched passwords – should fail with our custom message
        const bad1 = passwordSchema.safeParse({
            password: "abcdefgh",
            confirmPassword: "abcdxxxx",
            anotherField: "foo",
        });
        assert.strictEqual(bad1.success, false, "Mismatched passwords should fail");
        assert.ok(
            bad1.error.issues.some(
                (iss) => iss.message === "Passwords do not match" && iss.path[0] === "confirmPassword"
            ),
            "Custom issue for confirmPassword not found"
        );

        // ---------- usage #2: array custom check ----------
        const UniqueStringArray = z.array(z.string()).check((ctx) => {
            if (ctx.value.length > 3) {
                ctx.issues.push({
                    code: "too_big",
                    maximum: 3,
                    origin: "array",
                    inclusive: true,
                    message: "Too many items 😡",
                    input: ctx.value,
                });
            }
            if (ctx.value.length !== new Set(ctx.value).size) {
                ctx.issues.push({
                    code: "custom",
                    message: `No duplicates allowed.`,
                    input: ctx.value,
                });
            }
        });

        // too many items
        const bad2a = UniqueStringArray.safeParse(["a", "b", "c", "d"]);
        assert.strictEqual(bad2a.success, false, "Array longer than 3 should fail");
        assert.ok(
            bad2a.error.issues.some((iss) => iss.code === "too_big"),
            "Missing 'too_big' issue"
        );

        // duplicate items
        const bad2b = UniqueStringArray.safeParse(["a", "b", "a"]);
        assert.strictEqual(bad2b.success, false, "Array with duplicates should fail");
        assert.ok(
            bad2b.error.issues.some((iss) => iss.code === "custom"),
            "Missing 'custom' duplicate issue"
        );

        // valid array
        const ok2 = UniqueStringArray.safeParse(["x", "y", "z"]);
        assert.strictEqual(ok2.success, true, "Valid unique array of length ≤3 should succeed");

        // ---------- usage #3: string custom check ----------
        const myString = z.string().check(
            z.refine((val) => val.length > 8, { error: "Too short!" })
        );

        // too short
        const bad3 = myString.safeParse("short");
        assert.strictEqual(bad3.success, false, "String shorter than 9 chars should fail");
        assert.ok(
            bad3.error.issues.some((iss) => iss.message === "Too short!"),
            "Missing custom 'Too short!' issue"
        );

        // long enough
        const ok3 = myString.safeParse("this is long enough");
        assert.strictEqual(ok3.success, true, "String longer than 8 chars should succeed");

        done();
    });
});
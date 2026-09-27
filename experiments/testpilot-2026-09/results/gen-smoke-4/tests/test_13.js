let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.check', function(done) {
        const z = zod; // alias for brevity

        // ---------- Example #1: object with cross‑field check ----------
        const schema = z.object({
            password: z.string().min(8),
            confirmPassword: z.string(),
            anotherField: z.string()
        }).check(
            z.refine((data) => data.password === data.confirmPassword, {
                message: "Passwords do not match",
                path: ["confirmPassword"],
                when(payload) {
                    // only run when there are no issues on password/confirmPassword themselves
                    return payload.issues.every((iss) => {
                        const firstPathEl = iss.path?.[0];
                        return firstPathEl !== "password" && firstPathEl !== "confirmPassword";
                    });
                }
            })
        );

        // valid case – should not throw
        assert.doesNotThrow(() => {
            schema.parse({
                password: "verystrong",
                confirmPassword: "verystrong",
                anotherField: "ok"
            });
        });

        // invalid case – mismatched passwords
        try {
            schema.parse({
                password: "verystrong",
                confirmPassword: "different",
                anotherField: "ok"
            });
            assert.fail("Expected validation error for mismatched passwords");
        } catch (e) {
            // Zod throws a ZodError
            const issues = e.errors || e.issues || [];
            const pwdIssue = issues.find(issue => issue.path && issue.path[0] === "confirmPassword");
            assert(pwdIssue, "Missing issue on confirmPassword");
            assert.strictEqual(pwdIssue.message, "Passwords do not match");
        }

        // ---------- Example #2: array with custom check ----------
        const UniqueStringArray = z.array(z.string()).check((ctx) => {
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
        });

        // too many items
        try {
            UniqueStringArray.parse(["a", "b", "c", "d"]);
            assert.fail("Expected validation error for too many items");
        } catch (e) {
            const issues = e.errors || e.issues || [];
            const tooBig = issues.find(issue => issue.code === "too_big");
            assert(tooBig, "Missing too_big issue");
            assert.strictEqual(tooBig.message, "Too many items 😡");
        }

        // duplicate items
        try {
            UniqueStringArray.parse(["a", "b", "a"]);
            assert.fail("Expected validation error for duplicates");
        } catch (e) {
            const issues = e.errors || e.issues || [];
            const dup = issues.find(issue => issue.code === "custom");
            assert(dup, "Missing duplicate issue");
            assert.strictEqual(dup.message, "No duplicates allowed.");
        }

        // ---------- Example #3: string with custom refine ----------
        const myString = z.string().check(
            z.refine((val) => val.length > 8, { error: "Too short!" })
        );

        // valid string
        assert.doesNotThrow(() => {
            myString.parse("longenoughstring");
        });

        // too short
        try {
            myString.parse("short");
            assert.fail("Expected validation error for short string");
        } catch (e) {
            const issues = e.errors || e.issues || [];
            const short = issues.find(issue => issue.message === "Too short!");
            assert(short, "Missing Too short! issue");
        }

        done();
    });
});
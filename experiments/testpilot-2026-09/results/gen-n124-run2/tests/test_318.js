let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.object', function(done) {
        // 1️⃣ Basic object schema with nullable and superRefine
        const schema = zod.object(
            {
                first: zod.string(),
                second: zod.number(),
            },
            { required_error: "Missing object" } // params example
        )
        .nullable()
        .superRefine((arg, ctx) => {
            // arg can be null because of .nullable()
            if (arg === null) {
                ctx.addIssue({
                    code: zod.ZodIssueCode.custom,
                    message: "object should exist",
                });
            }
            // return type is never, but we just return undefined to satisfy runtime
            return undefined;
        });

        // a) Parsing null should fail with our custom issue
        const nullResult = schema.safeParse(null);
        assert.strictEqual(nullResult.success, false, "null should not be accepted");
        assert.ok(
            nullResult.error.issues.some(issue => issue.message === "object should exist"),
            "custom issue for null not found"
        );

        // b) Parsing a valid object should succeed
        const okResult = schema.safeParse({ first: "bob", second: 42 });
        assert.strictEqual(okResult.success, true, "valid object should be accepted");
        assert.deepStrictEqual(okResult.data, { first: "bob", second: 42 });

        // 2️⃣ Strict unknown keys handling via params
        const strictSchema = zod.object(
            { a: zod.string() },
            { unknownKeys: "strict" } // disallow extra keys
        );

        // a) Extra key should cause validation error
        const extraKeyResult = strictSchema.safeParse({ a: "hello", b: 123 });
        assert.strictEqual(extraKeyResult.success, false, "object with extra keys should be rejected");
        assert.ok(
            extraKeyResult.error.issues.some(issue => issue.code === zod.ZodIssueCode.unrecognized_keys),
            "unrecognized_keys issue not found"
        );

        // b) Object with only defined keys should pass
        const cleanResult = strictSchema.safeParse({ a: "world" });
        assert.strictEqual(cleanResult.success, true, "object with only known keys should be accepted");
        assert.deepStrictEqual(cleanResult.data, { a: "world" });

        done();
    });
});
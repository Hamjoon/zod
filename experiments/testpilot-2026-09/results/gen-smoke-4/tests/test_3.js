let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // Simple discriminated union (status)
        const SimpleResult = zod.z.discriminatedUnion("status", [
            zod.z.object({ status: zod.z.literal("success"), data: zod.z.string() }),
            zod.z.object({ status: zod.z.literal("failed"), error: zod.z.string() })
        ]);

        // Valid cases
        const ok = SimpleResult.parse({ status: "success", data: "hello" });
        assert.deepStrictEqual(ok, { status: "success", data: "hello" });

        const fail = SimpleResult.parse({ status: "failed", error: "boom" });
        assert.deepStrictEqual(fail, { status: "failed", error: "boom" });

        // Invalid case – mismatched shape for the discriminator
        assert.throws(() => {
            SimpleResult.parse({ status: "success", error: "oops" });
        }, /Invalid discriminator value/);

        // Nested discriminated union (status -> code)
        const BaseError = zod.z.object({
            status: zod.z.literal("failed"),
            message: zod.z.string()
        });

        const NestedResult = zod.z.discriminatedUnion("status", [
            zod.z.object({ status: zod.z.literal("success"), data: zod.z.string() }),
            // inner discriminated union on "code"
            zod.z.discriminatedUnion("code", [
                BaseError.extend({ code: zod.z.literal(400) }),
                BaseError.extend({ code: zod.z.literal(401) }),
                BaseError.extend({ code: zod.z.literal(500) })
            ])
        ]);

        // Valid success case
        const nestedSuccess = NestedResult.parse({ status: "success", data: "ok" });
        assert.deepStrictEqual(nestedSuccess, { status: "success", data: "ok" });

        // Valid error case with code 400
        const nestedError = NestedResult.parse({
            status: "failed",
            code: 400,
            message: "Bad request"
        });
        assert.deepStrictEqual(nestedError, {
            status: "failed",
            code: 400,
            message: "Bad request"
        });

        // Invalid nested case – missing required discriminator field "code"
        assert.throws(() => {
            NestedResult.parse({
                status: "failed",
                message: "Missing code"
            });
        }, /Invalid discriminator value/);

        done();
    });
});
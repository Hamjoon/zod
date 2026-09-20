let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // Simple discriminated union with two literal branches
        const SimpleUnion = zod.z.discriminatedUnion("status", [
            zod.z.object({ status: zod.z.literal("success"), data: zod.z.string() }),
            zod.z.object({ status: zod.z.literal("failed"), error: zod.z.string() })
        ]);

        // Valid cases
        const success = SimpleUnion.parse({ status: "success", data: "ok" });
        assert.deepStrictEqual(success, { status: "success", data: "ok" });

        const failed = SimpleUnion.parse({ status: "failed", error: "boom" });
        assert.deepStrictEqual(failed, { status: "failed", error: "boom" });

        // Invalid cases – should throw
        assert.throws(() => SimpleUnion.parse({ data: "missing status" }));
        assert.throws(() => SimpleUnion.parse({ status: "unknown", data: "x" }));

        // Union discriminator (status can be "a" or "b")
        const UnionDiscriminator = zod.z.discriminatedUnion("status", [
            zod.z.object({
                status: zod.z.union([zod.z.literal("a"), zod.z.literal("b")]),
                value: zod.z.number()
            })
        ]);

        const unionOk = UnionDiscriminator.parse({ status: "a", value: 42 });
        assert.deepStrictEqual(unionOk, { status: "a", value: 42 });

        // Pipe discriminator with a transform (status "fail" becomes "FAIL")
        const PipeDiscriminator = zod.z.discriminatedUnion("status", [
            zod.z.object({
                status: zod.z.literal("fail").transform(v => v.toUpperCase()),
                reason: zod.z.string()
            })
        ]);

        const pipeOk = PipeDiscriminator.parse({ status: "fail", reason: "bad request" });
        assert.deepStrictEqual(pipeOk, { status: "FAIL", reason: "bad request" });

        // Nested discriminated union (example #2)
        const BaseError = zod.z.object({ status: zod.z.literal("failed"), message: zod.z.string() });
        const NestedUnion = zod.z.discriminatedUnion("status", [
            zod.z.object({ status: zod.z.literal("success"), data: zod.z.string() }),
            zod.z.discriminatedUnion("code", [
                BaseError.extend({ code: zod.z.literal(400) }),
                BaseError.extend({ code: zod.z.literal(401) }),
                BaseError.extend({ code: zod.z.literal(500) })
            ])
        ]);

        const nestedOk = NestedUnion.parse({ status: "failed", code: 401, message: "unauthorized" });
        assert.deepStrictEqual(nestedOk, { status: "failed", code: 401, message: "unauthorized" });

        done();
    });
});
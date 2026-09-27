let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // ----- simple discriminated union with literal, union and transform -----
        const SimpleUnion = zod.z.discriminatedUnion("status", [
            zod.z.object({ status: zod.z.literal("aaa"), data: zod.z.string() }),
            zod.z.object({ status: zod.z.union([zod.z.literal("bbb"), zod.z.literal("ccc")]) }),
            zod.z.object({ status: zod.z.literal("fail").transform(v => v.toUpperCase()) })
        ]);

        // valid cases
        assert.deepStrictEqual(SimpleUnion.parse({ status: "aaa", data: "hello" }), { status: "aaa", data: "hello" });
        assert.deepStrictEqual(SimpleUnion.parse({ status: "bbb" }), { status: "bbb" });
        assert.deepStrictEqual(SimpleUnion.parse({ status: "ccc" }), { status: "ccc" });
        // transform case – status should be upper‑cased after parsing
        assert.deepStrictEqual(SimpleUnion.parse({ status: "fail" }), { status: "FAIL" });

        // invalid case – unknown discriminator value
        assert.throws(() => SimpleUnion.parse({ status: "unknown" }), /Invalid discriminator value/);

        // ----- nested discriminated union (status → code) -----
        const BaseError = zod.z.object({
            status: zod.z.literal("failed"),
            message: zod.z.string()
        });

        const NestedUnion = zod.z.discriminatedUnion("status", [
            zod.z.object({ status: zod.z.literal("success"), data: zod.z.string() }),
            zod.z.discriminatedUnion("code", [
                BaseError.extend({ code: zod.z.literal(400) }),
                BaseError.extend({ code: zod.z.literal(401) }),
                BaseError.extend({ code: zod.z.literal(500) })
            ])
        ]);

        // valid success case
        assert.deepStrictEqual(NestedUnion.parse({ status: "success", data: "ok" }), { status: "success", data: "ok" });
        // valid error cases
        assert.deepStrictEqual(NestedUnion.parse({ status: "failed", message: "bad", code: 400 }), { status: "failed", message: "bad", code: 400 });
        assert.deepStrictEqual(NestedUnion.parse({ status: "failed", message: "unauth", code: 401 }), { status: "failed", message: "unauth", code: 401 });
        // invalid code – should throw
        assert.throws(() => NestedUnion.parse({ status: "failed", message: "oops", code: 999 }), /Invalid discriminator value/);

        // ----- simple two‑branch discriminated union (usage #3) -----
        const SimpleTwo = zod.z.discriminatedUnion("status", [
            zod.z.object({ status: zod.z.literal("success"), data: zod.z.string() }),
            zod.z.object({ status: zod.z.literal("failed"), error: zod.z.string() })
        ]);

        assert.deepStrictEqual(SimpleTwo.parse({ status: "success", data: "all good" }), { status: "success", data: "all good" });
        assert.deepStrictEqual(SimpleTwo.parse({ status: "failed", error: "boom" }), { status: "failed", error: "boom" });
        assert.throws(() => SimpleTwo.parse({ status: "unknown" }), /Invalid discriminator value/);

        done();
    });
});
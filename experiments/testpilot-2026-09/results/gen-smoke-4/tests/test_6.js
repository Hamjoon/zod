let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // ----- Example 1: simple literals, union and transform discriminators -----
        const MyResult1 = zod.z.discriminatedUnion("status", [
            // simple literal
            zod.z.object({ status: zod.z.literal("aaa"), data: zod.z.string() }),
            // union discriminator
            zod.z.object({ status: zod.z.union([zod.z.literal("bbb"), zod.z.literal("ccc")]) }),
            // pipe (transform) discriminator
            zod.z.object({ status: zod.z.literal("fail").transform(val => val.toUpperCase()) })
        ]);

        // valid cases
        assert.deepStrictEqual(MyResult1.parse({ status: "aaa", data: "hello" }), { status: "aaa", data: "hello" });
        assert.deepStrictEqual(MyResult1.parse({ status: "bbb" }), { status: "bbb" });
        assert.deepStrictEqual(MyResult1.parse({ status: "ccc" }), { status: "ccc" });
        // transform case: input "fail" becomes "FAIL"
        assert.deepStrictEqual(MyResult1.parse({ status: "fail" }), { status: "FAIL" });

        // invalid case: unknown discriminator value
        assert.throws(() => MyResult1.parse({ status: "unknown" }), /Invalid discriminator value/);

        // ----- Example 2: nested discriminatedUnion -----
        const BaseError = zod.z.object({ status: zod.z.literal("failed"), message: zod.z.string() });
        const MyResult2 = zod.z.discriminatedUnion("status", [
            zod.z.object({ status: zod.z.literal("success"), data: zod.z.string() }),
            zod.z.discriminatedUnion("code", [
                BaseError.extend({ code: zod.z.literal(400) }),
                BaseError.extend({ code: zod.z.literal(401) }),
                BaseError.extend({ code: zod.z.literal(500) })
            ])
        ]);

        // success case
        assert.deepStrictEqual(
            MyResult2.parse({ status: "success", data: "ok" }),
            { status: "success", data: "ok" }
        );

        // error cases with nested discriminator
        const err400 = MyResult2.parse({ status: "failed", message: "bad request", code: 400 });
        assert.deepStrictEqual(err400, { status: "failed", message: "bad request", code: 400 });

        const err500 = MyResult2.parse({ status: "failed", message: "server error", code: 500 });
        assert.deepStrictEqual(err500, { status: "failed", message: "server error", code: 500 });

        // invalid nested code
        assert.throws(() => MyResult2.parse({ status: "failed", message: "oops", code: 999 }), /Invalid discriminator value/);

        // ----- Example 3: simple union of objects -----
        const MyResult3 = zod.z.discriminatedUnion("status", [
            zod.z.object({ status: zod.z.literal("success"), data: zod.z.string() }),
            zod.z.object({ status: zod.z.literal("failed"), error: zod.z.string() })
        ]);

        assert.deepStrictEqual(
            MyResult3.parse({ status: "success", data: "all good" }),
            { status: "success", data: "all good" }
        );
        assert.deepStrictEqual(
            MyResult3.parse({ status: "failed", error: "something went wrong" }),
            { status: "failed", error: "something went wrong" }
        );

        // invalid status
        assert.throws(() => MyResult3.parse({ status: "unknown", data: "x" }), /Invalid discriminator value/);

        done();
    });
});
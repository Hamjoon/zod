let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // Example #1 – simple literals, union and transformed discriminator
        const MyResult1 = zod.z.discriminatedUnion("status", [
            // simple literal
            zod.z.object({ status: zod.z.literal("aaa"), data: zod.z.string() }),
            // union discriminator (no extra fields)
            zod.z.object({ status: zod.z.union([zod.z.literal("bbb"), zod.z.literal("ccc")]) }),
            // pipe discriminator with transform
            zod.z.object({ status: zod.z.literal("fail").transform(val => val.toUpperCase()) })
        ]);

        // valid cases
        assert.deepStrictEqual(MyResult1.parse({ status: "aaa", data: "hello" }), { status: "aaa", data: "hello" });
        assert.deepStrictEqual(MyResult1.parse({ status: "bbb" }), { status: "bbb" });
        assert.deepStrictEqual(MyResult1.parse({ status: "fail" }), { status: "FAIL" });

        // invalid case – unknown discriminator
        assert.throws(() => MyResult1.parse({ status: "unknown" }), /Invalid discriminator value/);

        // Example #2 – nested discriminated unions
        const BaseError = zod.z.object({ status: zod.z.literal("failed"), message: zod.z.string() });
        const MyResult2 = zod.z.discriminatedUnion("status", [
            zod.z.object({ status: zod.z.literal("success"), data: zod.z.string() }),
            zod.z.discriminatedUnion("code", [
                BaseError.extend({ code: zod.z.literal(400) }),
                BaseError.extend({ code: zod.z.literal(401) }),
                BaseError.extend({ code: zod.z.literal(500) })
            ])
        ]);

        // valid success case
        assert.deepStrictEqual(MyResult2.parse({ status: "success", data: "ok" }), { status: "success", data: "ok" });
        // valid error cases
        assert.deepStrictEqual(
            MyResult2.parse({ status: "failed", message: "Bad request", code: 400 }),
            { status: "failed", message: "Bad request", code: 400 }
        );
        assert.deepStrictEqual(
            MyResult2.parse({ status: "failed", message: "Unauthorized", code: 401 }),
            { status: "failed", message: "Unauthorized", code: 401 }
        );

        // invalid nested discriminator
        assert.throws(() => MyResult2.parse({ status: "failed", message: "Oops", code: 999 }), /Invalid discriminator value/);

        // Example #3 – simple discriminated union with two branches
        const MyResult3 = zod.z.discriminatedUnion("status", [
            zod.z.object({ status: zod.z.literal("success"), data: zod.z.string() }),
            zod.z.object({ status: zod.z.literal("failed"), error: zod.z.string() })
        ]);

        // valid branches
        assert.deepStrictEqual(MyResult3.parse({ status: "success", data: "all good" }), { status: "success", data: "all good" });
        assert.deepStrictEqual(MyResult3.parse({ status: "failed", error: "something broke" }), { status: "failed", error: "something broke" });

        // invalid branch – missing required field
        assert.throws(() => MyResult3.parse({ status: "success" }), /Required/);

        done();
    });
});
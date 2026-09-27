let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        const { z } = zod;

        // usage #1 – various discriminator forms
        const MyResult1 = z.discriminatedUnion("status", [
            z.object({ status: z.literal("aaa"), data: z.string() }),
            z.object({ status: z.union([z.literal("bbb"), z.literal("ccc")]) }),
            z.object({ status: z.literal("fail").transform(val => val.toUpperCase()) })
        ]);

        // valid parses
        assert.deepStrictEqual(MyResult1.parse({ status: "aaa", data: "hello" }), { status: "aaa", data: "hello" });
        assert.deepStrictEqual(MyResult1.parse({ status: "bbb" }), { status: "bbb" });
        assert.deepStrictEqual(MyResult1.parse({ status: "ccc" }), { status: "ccc" });
        assert.deepStrictEqual(MyResult1.parse({ status: "fail" }), { status: "FAIL" });

        // invalid discriminator value
        // Zod throws a ZodError whose message contains “Invalid input” for an unknown discriminator.
        assert.throws(() => MyResult1.parse({ status: "unknown" }), /Invalid input/);

        // usage #2 – nested discriminatedUnion
        const BaseError = z.object({ status: z.literal("failed"), message: z.string() });
        const MyResult2 = z.discriminatedUnion("status", [
            z.object({ status: z.literal("success"), data: z.string() }),
            z.discriminatedUnion("code", [
                BaseError.extend({ code: z.literal(400) }),
                BaseError.extend({ code: z.literal(401) }),
                BaseError.extend({ code: z.literal(500) })
            ])
        ]);

        // success case
        assert.deepStrictEqual(MyResult2.parse({ status: "success", data: "ok" }), { status: "success", data: "ok" });
        // error cases
        assert.deepStrictEqual(MyResult2.parse({ status: "failed", message: "bad", code: 400 }), { status: "failed", message: "bad", code: 400 });
        assert.deepStrictEqual(MyResult2.parse({ status: "failed", message: "unauth", code: 401 }), { status: "failed", message: "unauth", code: 401 });
        // invalid nested discriminator
        assert.throws(() => MyResult2.parse({ status: "failed", message: "oops", code: 402 }), /Invalid input/);

        // usage #3 – simple literal discriminators
        const MyResult3 = z.discriminatedUnion("status", [
            z.object({ status: z.literal("success"), data: z.string() }),
            z.object({ status: z.literal("failed"), error: z.string() })
        ]);

        assert.deepStrictEqual(MyResult3.parse({ status: "success", data: "x" }), { status: "success", data: "x" });
        assert.deepStrictEqual(MyResult3.parse({ status: "failed", error: "oops" }), { status: "failed", error: "oops" });
        // unknown discriminator
        assert.throws(() => MyResult3.parse({ status: "unknown" }), /Invalid input/);

        done();
    });
});
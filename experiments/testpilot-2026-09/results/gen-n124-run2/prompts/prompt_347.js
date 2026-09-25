The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // ----- Example 1: mixed discriminators (literal, union, transform) -----
        const MyResult1 = zod.discriminatedUnion("status", [
            zod.object({ status: zod.literal("aaa"), data: zod.string() }),
            zod.object({ status: zod.union([zod.literal("bbb"), zod.literal("ccc")]) }),
            zod.object({ status: zod.literal("fail").transform(val => val.toUpperCase()) })
        ]);

        // valid literal case
        const parsedA = MyResult1.parse({ status: "aaa", data: "hello" });
        assert.deepStrictEqual(parsedA, { status: "aaa", data: "hello" });

        // valid union case (no extra fields)
        const parsedB = MyResult1.parse({ status: "bbb" });
        assert.deepStrictEqual(parsedB, { status: "bbb" });

        // valid transformed case
        const parsedFail = MyResult1.parse({ status: "fail" });
        assert.deepStrictEqual(parsedFail, { status: "FAIL" });

        // invalid case – unknown discriminator value
        assert.throws(() => MyResult1.parse({ status: "unknown" }), /Invalid discriminator value/);

        // ----- Example 2: nested discriminatedUnion -----
        const BaseError = zod.object({ status: zod.literal("failed"), message: zod.string() });
        const MyResult2 = zod.discriminatedUnion("status", [
            zod.object({ status: zod.literal("success"), data: zod.string() }),
            zod.discriminatedUnion("code", [
                BaseError.extend({ code: zod.literal(400) }),
                BaseError.extend({ code: zod.literal(401) }),
                BaseError.extend({ code: zod.literal(500) })
            ])
        ]);

        // success branch
        const parsedSuccess = MyResult2.parse({ status: "success", data: "ok" });
        assert.deepStrictEqual(parsedSuccess, { status: "success", data: "ok" });

        // error branch with code 401
        const parsedError = MyResult2.parse({ status: "failed", message: "unauthorized", code: 401 });
        assert.deepStrictEqual(parsedError, { status: "failed", message: "unauthorized", code: 401 });

        // invalid nested discriminator
        assert.throws(() => MyResult2.parse({ status: "failed", message: "bad", code: 999 }), /Invalid discriminator value/);

        // ----- Example 3: simple two‑branch discriminatedUnion -----
        const MyResult3 = zod.discriminatedUnion("status", [
            zod.object({ status: zod.literal("success"), data: zod.string() }),
            zod.object({ status: zod.literal("failed"), error: zod.string() })
        ]);

        const parsedSuccess3 = MyResult3.parse({ status: "success", data: "all good" });
        assert.deepStrictEqual(parsedSuccess3, { status: "success", data: "all good" });

        const parsedFailed3 = MyResult3.parse({ status: "failed", error: "something went wrong" });
        assert.deepStrictEqual(parsedFailed3, { status: "failed", error: "something went wrong" });

        // wrong discriminator value should throw
        assert.throws(() => MyResult3.parse({ status: "pending" }), /Invalid discriminator value/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Invalid discriminator value/. Input:

'[\n' +
  '  {\n' +
  '    "code": "invalid_union",\n' +
  '    "errors": [],\n' +
  '    "note": "No matching discriminator",\n' +
  '    "path": [\n' +
  '      "status"\n' +
  '    ],\n' +
  '    "message": "Invalid input"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.
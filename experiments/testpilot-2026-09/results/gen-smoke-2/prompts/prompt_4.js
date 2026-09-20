The test:
```
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
        assert.throws(() => MyResult1.parse({ status: "unknown" }), /Invalid discriminator value/);

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
        assert.throws(() => MyResult2.parse({ status: "failed", message: "oops", code: 402 }), /Invalid discriminator value/);

        // usage #3 – simple literal discriminators
        const MyResult3 = z.discriminatedUnion("status", [
            z.object({ status: z.literal("success"), data: z.string() }),
            z.object({ status: z.literal("failed"), error: z.string() })
        ]);

        assert.deepStrictEqual(MyResult3.parse({ status: "success", data: "x" }), { status: "success", data: "x" });
        assert.deepStrictEqual(MyResult3.parse({ status: "failed", error: "oops" }), { status: "failed", error: "oops" });
        assert.throws(() => MyResult3.parse({ status: "unknown" }), /Invalid discriminator value/);

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
The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.record', function(done) {
        // 1️⃣ Simple record with string keys and string values
        const stringRecord = zod.z.record(zod.z.string(), zod.z.string());
        const validObj1 = { carlotta: "77d2586b-9e8e-4ecf-8b21-ea7e0530eadd", jimmie: "77d2586b-9e8e-4ecf-8b21-ea7e0530eadd" };
        assert.deepStrictEqual(stringRecord.parse(validObj1), validObj1, 'String record should parse correctly');

        // 2️⃣ Record with enum keys and number values – only allowed keys should pass
        const enumRecord = zod.z.record(zod.z.enum(["a", "b", "c"]), zod.z.number());

        // a) Valid keys and values
        const validObj2 = { a: 1, b: 2, c: 3 };
        assert.deepStrictEqual(enumRecord.parse(validObj2), validObj2, 'Enum record with valid keys should parse');

        // b) Invalid key should throw
        const invalidKeyObj = { a: 1, d: 4 };
        assert.throws(() => enumRecord.parse(invalidKeyObj), /Invalid key/, 'Enum record should reject unknown keys');

        // c) Invalid value type should throw
        const invalidValueObj = { a: "not a number", b: 2 };
        assert.throws(() => enumRecord.parse(invalidValueObj), /Expected number/, 'Enum record should reject wrong value types');

        // 3️⃣ Nested record (JSON‑like) using lazy recursion
        const literalSchema = zod.z.union([zod.z.string(), zod.z.number(), zod.z.boolean(), zod.z.null()]);
        const jsonSchema = zod.z.lazy(() => zod.z.union([
            literalSchema,
            zod.z.array(jsonSchema),
            zod.z.record(jsonSchema)
        ]));
        const jsonData = {
            name: "Alice",
            age: 30,
            active: true,
            meta: {
                tags: ["admin", "user"],
                scores: { math: 95, english: 88 }
            }
        };
        assert.deepStrictEqual(jsonSchema.parse(jsonData), jsonData, 'Lazy JSON schema should parse complex nested records');

        done();
    });
});
``` 
failed with the following error message:
```
Enum record should reject unknown keys  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.
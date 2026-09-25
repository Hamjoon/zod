let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.record', function(done) {
        // 1. Simple string -> string record
        const strRecord = zod.record(zod.string(), zod.string());
        const validStringObj = { carlotta: "77d2586b-9e8e-4ecf-8b21-ea7e0530eadd", jimmie: "77d2586b-9e8e-4ecf-8b21-ea7e0530eadd" };
        assert.deepStrictEqual(strRecord.parse(validStringObj), validStringObj);
        assert.throws(() => strRecord.parse({ carlotta: 123 })); // value not a string

        // 2. Enum keys with number values
        const enumKey = zod.enum(["a", "b", "c"]);
        const enumRecord = zod.record(enumKey, zod.number());
        const validEnumObj = { a: 1, b: 2, c: 3 };
        assert.deepStrictEqual(enumRecord.parse(validEnumObj), validEnumObj);
        assert.throws(() => enumRecord.parse({ a: 1, d: 4 })); // invalid key

        // 3. Recursive JSON schema using z.record
        const literal = zod.union([zod.string(), zod.number(), zod.boolean(), zod.null()]);
        const jsonSchema = zod.lazy(() => zod.union([literal, zod.array(jsonSchema), zod.record(jsonSchema)]));
        const jsonData = {
            name: "Alice",
            age: 30,
            active: true,
            tags: ["friend", null, 42],
            nested: { foo: "bar", num: 5 }
        };
        assert.deepStrictEqual(jsonSchema.parse(jsonData), jsonData);
        assert.throws(() => jsonSchema.parse({ bad: undefined })); // undefined is not allowed

        done();
    });
});
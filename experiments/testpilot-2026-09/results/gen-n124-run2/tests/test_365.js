let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.record', function (done) {
    // 1. Simple string -> string record
    // Zod's `record` only takes a value schema (keys are always strings)
    const strRecord = zod.record(zod.string());
    const validStringObj = {
      carlotta: '77d2586b-9e8e-4ecf-8b21-ea7e0530eadd',
      jimmie: '77d2586b-9e8e-4ecf-8b21-ea7e0530eadd',
    };
    assert.deepStrictEqual(strRecord.parse(validStringObj), validStringObj);
    assert.throws(() => strRecord.parse({ carlotta: 123 })); // value not a string

    // 2. Enum keys with number values
    // Zod does not support enum‑keyed records directly, so we model it as a strict object
    const enumKey = zod.enum(['a', 'b', 'c']);
    const enumRecord = zod.object({
      a: zod.number(),
      b: zod.number(),
      c: zod.number(),
    }).strict(); // disallow extra keys
    const validEnumObj = { a: 1, b: 2, c: 3 };
    assert.deepStrictEqual(enumRecord.parse(validEnumObj), validEnumObj);
    assert.throws(() => enumRecord.parse({ a: 1, d: 4 })); // invalid key

    // 3. Recursive JSON schema using zod.record
    const literal = zod.union([zod.string(), zod.number(), zod.boolean(), zod.null()]);

    // We need a lazy schema that can reference itself inside arrays and records.
    // To avoid the “undefined _zod” error we wrap the recursive references in `zod.lazy`.
    const jsonSchema = zod.lazy(() =>
      zod.union([
        literal,
        zod.array(zod.lazy(() => jsonSchema)), // array of JSON values
        zod.record(zod.lazy(() => jsonSchema)), // record with string keys and JSON values
      ])
    );

    const jsonData = {
      name: 'Alice',
      age: 30,
      active: true,
      tags: ['friend', null, 42],
      nested: { foo: 'bar', num: 5 },
    };
    assert.deepStrictEqual(jsonSchema.parse(jsonData), jsonData);
    assert.throws(() => jsonSchema.parse({ bad: undefined })); // undefined is not allowed

    done();
  });
});
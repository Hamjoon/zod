let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.partialRecord', function (done) {
        // Create a partialRecord schema with string keys and number values
        const schema = zod.z.partialRecord(zod.z.string(), zod.z.number());

        // 1. Verify internal definition
        // The schema should be a ZodRecord
        assert.strictEqual(schema._def.type, "record", "Schema type should be 'record'");

        // The keyType should be a union of the original key type and never()
        const keyTypeDef = schema._def.keyType._def;
        assert.strictEqual(keyTypeDef.type, "union", "keyType should be a union");
        // Union should have exactly two options
        assert.strictEqual(schema._def.keyType._def.options.length, 2, "Union should have two options");
        // One option should be string, the other never
        const optionTypes = schema._def.keyType._def.options.map(o => o._def.type).sort();
        assert.deepStrictEqual(optionTypes, ["never", "string"], "Union options should be string and never");

        // 2. Parsing valid objects
        // Valid object with correct key/value types
        assert.deepStrictEqual(schema.parse({ foo: 42, bar: 0 }), { foo: 42, bar: 0 });
        // Empty object should also be valid
        assert.deepStrictEqual(schema.parse({}), {});

        // 3. Parsing invalid objects
        // Invalid value type (string instead of number)
        assert.throws(() => schema.parse({ foo: "not a number" }), /Expected number, received string/);

        // Note: In JavaScript object literals, numeric keys are coerced to strings,
        // so they still satisfy the string key schema. Therefore we do not test
        // an invalid key case here.

        done();
    });
});
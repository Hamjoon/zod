let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.record', function(done) {
        // create a record schema where keys must be strings and values must be numbers
        const schema = zod.z.record(zod.z.string(), zod.z.number());

        // ---- Valid case -------------------------------------------------
        const validObj = { foo: 1, bar: 42 };
        // parse should succeed and return the same object
        const parsed = schema.parse(validObj);
        assert.deepStrictEqual(parsed, validObj, 'Valid record should parse unchanged');

        // ---- Invalid case (wrong value type) ---------------------------
        const invalidObj = { foo: 1, baz: "not a number" };
        const result = schema.safeParse(invalidObj);
        assert.strictEqual(result.success, false, 'Record with invalid value type should fail');

        // ---- Invalid case (key type is not a string) --------------------
        // JavaScript object keys are always strings/symbols, but we can test that
        // passing a prototype-less object with a non‑string key via Map is rejected.
        // Using a plain object, this scenario can't be expressed, so we focus on value validation.

        done();
    });
});
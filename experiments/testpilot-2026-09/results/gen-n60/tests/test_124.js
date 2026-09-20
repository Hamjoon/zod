let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nullable', function(done) {
        // simple nullable string
        const nullableString = zod.z.string().nullable();

        // should accept null
        assert.strictEqual(nullableString.parse(null), null);

        // should accept a valid string
        assert.strictEqual(nullableString.parse('hello'), 'hello');

        // should reject non‑string, non‑null values
        assert.throws(() => nullableString.parse(123), err => {
            return err instanceof zod.ZodError;
        });

        // nullable object schema
        const nullableObj = zod.z.object({ a: zod.z.number() }).nullable();

        // null is valid
        assert.strictEqual(nullableObj.parse(null), null);

        // valid object passes through
        const parsedObj = nullableObj.parse({ a: 42 });
        assert.deepStrictEqual(parsedObj, { a: 42 });

        // missing required property should throw
        assert.throws(() => nullableObj.parse({}), err => {
            return err instanceof zod.ZodError;
        });

        // wrong type for property should throw
        assert.throws(() => nullableObj.parse({ a: 'not a number' }), err => {
            return err instanceof zod.ZodError;
        });

        done();
    });
});
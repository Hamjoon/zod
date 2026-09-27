let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nullish', function(done) {
        // Create a nullish schema for strings
        const schema = zod.string().nullish(); // string | null | undefined

        // ---- Valid values ----
        // string
        let res = schema.safeParse('hello');
        assert.strictEqual(res.success, true);
        assert.strictEqual(res.data, 'hello');

        // null
        res = schema.safeParse(null);
        assert.strictEqual(res.success, true);
        assert.strictEqual(res.data, null);

        // undefined
        res = schema.safeParse(undefined);
        assert.strictEqual(res.success, true);
        assert.strictEqual(res.data, undefined);

        // ---- Invalid value ----
        // number should fail
        res = schema.safeParse(123);
        assert.strictEqual(res.success, false);
        assert.ok(res.error instanceof zod.ZodError);

        // ---- Equivalence to nullable().optional() ----
        const schemaAlt = zod.string().nullable().optional(); // should behave the same
        // compare results for a set of inputs
        const inputs = ['test', null, undefined];
        inputs.forEach(input => {
            const a = schema.safeParse(input);
            const b = schemaAlt.safeParse(input);
            assert.deepStrictEqual(a, b);
        });

        done();
    });
});
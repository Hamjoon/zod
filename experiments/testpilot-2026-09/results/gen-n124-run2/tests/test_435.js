let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nullish', function(done) {
        // Create a nullish string schema
        const schema = zod.string().nullish(); // string | null | undefined

        // ---- Positive cases ----
        // undefined should be accepted
        assert.strictEqual(schema.safeParse(undefined).success, true, 'undefined should be valid');
        // null should be accepted
        assert.strictEqual(schema.safeParse(null).success, true, 'null should be valid');
        // a valid string should be accepted
        assert.strictEqual(schema.safeParse('hello world').success, true, 'valid string should be valid');

        // ---- Negative case ----
        // a number should be rejected
        assert.strictEqual(schema.safeParse(42).success, false, 'number should be invalid');

        // ---- Equivalence with nullable().optional() ----
        const equivalent = zod.string().nullable().optional();
        // The parse results (including data and errors) should be identical for a variety of inputs
        const inputs = [undefined, null, 'test'];
        inputs.forEach(input => {
            const resultA = schema.safeParse(input);
            const resultB = equivalent.safeParse(input);
            assert.deepStrictEqual(resultA, resultB, `nullish and nullable().optional() should behave the same for input: ${input}`);
        });

        done();
    });
});
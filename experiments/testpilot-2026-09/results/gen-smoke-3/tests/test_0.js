let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // Define two object schemas that share the discriminator key "kind"
        const ShapeA = zod.z.object({
            kind: zod.z.literal('a'),
            foo: zod.z.string()
        });

        const ShapeB = zod.z.object({
            kind: zod.z.literal('b'),
            bar: zod.z.number()
        });

        // Create the discriminated union schema
        const Union = zod.z.discriminatedUnion('kind', [ShapeA, ShapeB]);

        // ---- Positive cases -------------------------------------------------
        // Valid instance of ShapeA
        const a = { kind: 'a', foo: 'hello' };
        assert.deepStrictEqual(Union.parse(a), a);

        // Valid instance of ShapeB
        const b = { kind: 'b', bar: 42 };
        assert.deepStrictEqual(Union.parse(b), b);

        // ---- Negative cases -------------------------------------------------
        // Missing discriminator key
        assert.throws(
            () => Union.parse({ foo: 'missing kind' }),
            /Invalid discriminator value/
        );

        // Discriminator value not covered by any option
        assert.throws(
            () => Union.parse({ kind: 'c', foo: 'unknown kind' }),
            /Invalid discriminator value/
        );

        done();
    });
});
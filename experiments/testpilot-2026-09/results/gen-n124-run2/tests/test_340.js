let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // Define two object schemas that share the discriminator key "kind"
        const A = zod.object({
            kind: zod.literal('a'),
            name: zod.string()
        });
        const B = zod.object({
            kind: zod.literal('b'),
            age: zod.number()
        });

        // Build a discriminated union using the public API
        const UnionSchema = zod.z.discriminatedUnion('kind', [A, B]);

        // ---- Positive test cases -------------------------------------------------
        // Object that matches the first variant
        const aObj = { kind: 'a', name: 'Alice' };
        const parsedA = UnionSchema.parse(aObj);
        assert.deepStrictEqual(parsedA, aObj, 'Should parse variant A correctly');

        // Object that matches the second variant
        const bObj = { kind: 'b', age: 30 };
        const parsedB = UnionSchema.parse(bObj);
        assert.deepStrictEqual(parsedB, bObj, 'Should parse variant B correctly');

        // ---- Negative test cases -------------------------------------------------
        // Wrong discriminator value
        const invalidKind = { kind: 'c', foo: 'bar' };
        assert.throws(() => UnionSchema.parse(invalidKind), err => {
            // Zod returns a ZodError; we only need to be sure it throws
            return err instanceof zod.ZodError;
        }, 'Should throw on unknown discriminator value');

        // Missing discriminator key
        const missingKind = { name: 'Bob' };
        assert.throws(() => UnionSchema.parse(missingKind), err => err instanceof zod.ZodError,
            'Should throw when discriminator key is missing');

        // Verify internal definition (optional but useful)
        assert.strictEqual(UnionSchema._def.discriminator, 'kind', 'Discriminator should be stored on schema definition');
        assert.ok(Array.isArray(UnionSchema._def.options), 'Options should be stored as an array on schema definition');

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // Define two object schemas that share a discriminant field `kind`
        const A = zod.object({ kind: zod.literal('a'), a: zod.string() });
        const B = zod.object({ kind: zod.literal('b'), b: zod.number() });

        // Create a discriminated union using the internal `z` namespace
        const Union = zod.z.discriminatedUnion('kind', [A, B]);

        // ---- Positive cases: valid data should parse correctly ----
        assert.deepStrictEqual(
            Union.parse({ kind: 'a', a: 'hello' }),
            { kind: 'a', a: 'hello' }
        );
        assert.deepStrictEqual(
            Union.parse({ kind: 'b', b: 123 }),
            { kind: 'b', b: 123 }
        );

        // ---- Negative case: unknown discriminator value should throw ----
        assert.throws(() => {
            Union.parse({ kind: 'c' });
        });

        // ---- Internal definition sanity checks ----
        const def = Union._def; // Zod stores schema metadata in `_def`
        assert.strictEqual(def.discriminator, 'kind');
        assert.deepStrictEqual(def.options, [A, B]);

        done();
    });
});
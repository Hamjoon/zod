let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // Create a discriminated union with discriminator key "type"
        const Union = zod.z.discriminatedUnion('type', [
            zod.z.object({
                type: zod.z.literal('foo'),
                foo: zod.z.string(),
            }),
            zod.z.object({
                type: zod.z.literal('bar'),
                bar: zod.z.number(),
            }),
        ]);

        // ----- Valid parses -------------------------------------------------
        // Should parse a "foo" variant correctly
        assert.doesNotThrow(() => {
            const parsed = Union.parse({ type: 'foo', foo: 'hello' });
            assert.deepStrictEqual(parsed, { type: 'foo', foo: 'hello' });
        });

        // Should parse a "bar" variant correctly
        assert.doesNotThrow(() => {
            const parsed = Union.parse({ type: 'bar', bar: 123 });
            assert.deepStrictEqual(parsed, { type: 'bar', bar: 123 });
        });

        // ----- Invalid parses ------------------------------------------------
        // Unknown discriminator value should throw a ZodError
        assert.throws(
            () => Union.parse({ type: 'baz', baz: true }),
            err => err instanceof zod.ZodError
        );

        // Missing discriminator key should also throw a ZodError
        assert.throws(
            () => Union.parse({ foo: 'hello' }),
            err => err instanceof zod.ZodError
        );

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // 1️⃣ Simple discriminated union with literal discriminators
        const Simple = zod.discriminatedUnion('status', [
            zod.object({ status: zod.literal('success'), data: zod.string() }),
            zod.object({ status: zod.literal('failed'), error: zod.string() })
        ]);

        // valid parses
        assert.deepStrictEqual(
            Simple.parse({ status: 'success', data: 'ok' }),
            { status: 'success', data: 'ok' }
        );
        assert.deepStrictEqual(
            Simple.parse({ status: 'failed', error: 'boom' }),
            { status: 'failed', error: 'boom' }
        );

        // invalid discriminator value should throw
        assert.throws(() => Simple.parse({ status: 'unknown', data: 'x' }));

        // 2️⃣ Discriminator that itself is a union of literals
        const UnionDisc = zod.discriminatedUnion('status', [
            zod.object({ status: zod.literal('aaa'), data: zod.string() }),
            zod.object({ status: zod.union([zod.literal('bbb'), zod.literal('ccc')]) })
        ]);

        assert.deepStrictEqual(
            UnionDisc.parse({ status: 'aaa', data: 'test' }),
            { status: 'aaa', data: 'test' }
        );
        assert.deepStrictEqual(
            UnionDisc.parse({ status: 'bbb' }),
            { status: 'bbb' }
        );
        assert.deepStrictEqual(
            UnionDisc.parse({ status: 'ccc' }),
            { status: 'ccc' }
        );
        assert.throws(() => UnionDisc.parse({ status: 'ddd' }));

        // 3️⃣ Nested discriminated unions
        const BaseError = zod.object({
            status: zod.literal('failed'),
            message: zod.string()
        });

        const Nested = zod.discriminatedUnion('status', [
            zod.object({ status: zod.literal('success'), data: zod.string() }),
            zod.discriminatedUnion('code', [
                BaseError.extend({ code: zod.literal(400) }),
                BaseError.extend({ code: zod.literal(401) }),
                BaseError.extend({ code: zod.literal(500) })
            ])
        ]);

        // valid parses for both branches
        assert.deepStrictEqual(
            Nested.parse({ status: 'success', data: 'ok' }),
            { status: 'success', data: 'ok' }
        );
        assert.deepStrictEqual(
            Nested.parse({ status: 'failed', message: 'bad', code: 400 }),
            { status: 'failed', message: 'bad', code: 400 }
        );

        // invalid code should throw
        assert.throws(() => Nested.parse({ status: 'failed', message: 'bad', code: 402 }));

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // ---------- Simple discriminated union ----------
        const Simple = zod.z.discriminatedUnion('status', [
            zod.z.object({ status: zod.z.literal('success'), data: zod.z.string() }),
            zod.z.object({ status: zod.z.literal('failed'), error: zod.z.string() })
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

        // invalid parse should throw
        assert.throws(() => Simple.parse({ status: 'unknown', data: 'x' }), zod.ZodError);

        // ---------- Nested discriminated union ----------
        const BaseError = zod.z.object({
            status: zod.z.literal('failed'),
            message: zod.z.string()
        });

        const Nested = zod.z.discriminatedUnion('status', [
            zod.z.object({ status: zod.z.literal('success'), data: zod.z.string() }),
            zod.z.discriminatedUnion('code', [
                BaseError.extend({ code: zod.z.literal(400) }),
                BaseError.extend({ code: zod.z.literal(401) }),
                BaseError.extend({ code: zod.z.literal(500) })
            ])
        ]);

        // valid nested parses
        assert.deepStrictEqual(
            Nested.parse({ status: 'success', data: 'ok' }),
            { status: 'success', data: 'ok' }
        );
        assert.deepStrictEqual(
            Nested.parse({ status: 'failed', message: 'bad', code: 401 }),
            { status: 'failed', message: 'bad', code: 401 }
        );

        // invalid nested parse should throw
        assert.throws(() => Nested.parse({ status: 'failed', message: 'bad', code: 999 }), zod.ZodError);

        // ---------- Discriminated union with transformed literal ----------
        const TransformUnion = zod.z.discriminatedUnion('status', [
            zod.z.object({ status: zod.z.literal('aaa'), data: zod.z.string() }),
            zod.z.object({ status: zod.z.union([zod.z.literal('bbb'), zod.z.literal('ccc')]) }),
            zod.z.object({ status: zod.z.literal('fail').transform(v => v.toUpperCase()) })
        ]);

        // transformed case
        const transformed = TransformUnion.parse({ status: 'fail' });
        assert.strictEqual(transformed.status, 'FAIL');

        done();
    });
});
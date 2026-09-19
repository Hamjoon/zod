let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.discriminatedUnion', function (done) {
        // ----- simple literal discriminator -----
        const Simple = zod.discriminatedUnion('status', [
            zod.object({ status: zod.literal('aaa'), data: zod.string() }),
            zod.object({ status: zod.literal('bbb') })
        ]);

        // valid parses
        assert.deepStrictEqual(Simple.parse({ status: 'aaa', data: 'hello' }), { status: 'aaa', data: 'hello' });
        assert.deepStrictEqual(Simple.parse({ status: 'bbb' }), { status: 'bbb' });

        // invalid discriminator value should throw
        assert.throws(() => Simple.parse({ status: 'ccc' }), /Invalid discriminator value/);

        // ----- nested discriminatedUnion (status + code) -----
        // Instead of nesting discriminatedUnion (which Zod does not support directly),
        // we flatten the branches into a single discriminatedUnion on `status`.
        const SuccessBranch = zod.object({
            status: zod.literal('success'),
            data: zod.string()
        });

        // error branches – each has the same `status` discriminator but a different `code`
        const BaseError = zod.object({
            status: zod.literal('failed'),
            message: zod.string()
        });

        const Error400 = BaseError.extend({ code: zod.literal(400) });
        const Error401 = BaseError.extend({ code: zod.literal(401) });
        const Error500 = BaseError.extend({ code: zod.literal(500) });

        const MyResult = zod.discriminatedUnion('status', [
            SuccessBranch,
            Error400,
            Error401,
            Error500
        ]);

        // success case
        const successObj = { status: 'success', data: 'ok' };
        assert.deepStrictEqual(MyResult.parse(successObj), successObj);

        // error cases
        const err400 = { status: 'failed', code: 400, message: 'Bad request' };
        const err401 = { status: 'failed', code: 401, message: 'Unauthorized' };
        const err500 = { status: 'failed', code: 500, message: 'Server error' };

        assert.deepStrictEqual(MyResult.parse(err400), err400);
        assert.deepStrictEqual(MyResult.parse(err401), err401);
        assert.deepStrictEqual(MyResult.parse(err500), err500);

        // wrong code should fail
        assert.throws(
            () => MyResult.parse({ status: 'failed', code: 404, message: 'Not found' }),
            /Invalid discriminator value/
        );

        // wrong status should fail
        assert.throws(
            () => MyResult.parse({ status: 'unknown', data: 'x' }),
            /Invalid discriminator value/
        );

        done();
    });
});
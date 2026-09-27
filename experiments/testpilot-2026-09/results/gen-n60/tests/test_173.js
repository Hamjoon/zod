let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.unknown', function(done) {
        const schema = zod.z.unknown();

        // a variety of values that should all be accepted
        const sym = Symbol('sym');
        const values = [
            undefined,
            null,
            0,
            42,
            '',
            'hello',
            true,
            false,
            { a: 1, b: 'x' },
            [1, 2, 3],
            sym
        ];

        values.forEach(val => {
            // .parse should return the exact same value
            const parsed = schema.parse(val);
            assert.strictEqual(parsed, val, `parse should return the original value for ${String(val)}`);

            // .safeParse should indicate success and contain the same data
            const result = schema.safeParse(val);
            assert.strictEqual(result.success, true, `.safeParse should succeed for ${String(val)}`);
            assert.strictEqual(result.data, val, `.safeParse data should equal the original value for ${String(val)}`);
        });

        done();
    });
});
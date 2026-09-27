let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.unknown', function(done) {
        const schema = zod.z.unknown();

        const values = [
            undefined,
            null,
            42,
            'hello',
            true,
            { a: 1 },
            [1, 2, 3],
            function () { return 'fn'; },
            Symbol('sym')
        ];

        values.forEach(val => {
            // .parse should return the exact same value
            const parsed = schema.parse(val);
            assert.strictEqual(parsed, val, `parse failed for value: ${String(val)}`);

            // .safeParse should indicate success and return the same data
            const result = schema.safeParse(val);
            assert.strictEqual(result.success, true, `.safeParse reported failure for value: ${String(val)}`);
            assert.strictEqual(result.data, val, `.safeParse returned different data for value: ${String(val)}`);
        });

        done();
    });
});
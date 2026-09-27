let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.any', function(done) {
        const schema = zod.any();

        const testValues = [
            null,
            undefined,
            42,
            'hello',
            true,
            false,
            { foo: 'bar' },
            [1, 2, 3],
            Symbol('sym'),
            BigInt(123),
            new Date()
        ];

        testValues.forEach(value => {
            // parse should return the original value unchanged
            const parsed = schema.parse(value);
            assert.strictEqual(parsed, value, `parse should return the original value for ${String(value)}`);

            // safeParse should succeed and contain the same data
            const result = schema.safeParse(value);
            assert.strictEqual(result.success, true, `safeParse should succeed for ${String(value)}`);
            assert.strictEqual(result.data, value, `safeParse data should equal the original value for ${String(value)}`);
        });

        done();
    });
});
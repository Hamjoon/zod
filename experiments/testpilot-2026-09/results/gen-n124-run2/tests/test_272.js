let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.any', function(done) {
        // Zod v3 exports the schema builder directly (zod.any), but some
        // environments expose it via a `z` property. Handle both.
        const anySchema = (zod.z && typeof zod.z.any === 'function')
            ? zod.z.any()
            : zod.any();

        // Values of various types that should all be accepted by `any()`
        const testValues = [
            undefined,
            null,
            123,
            'hello world',
            { foo: 'bar' },
            [1, 2, 3],
            true,
            Symbol('sym')
        ];

        testValues.forEach(value => {
            // `parse` should return the exact same value
            assert.deepStrictEqual(anySchema.parse(value), value);

            // `safeParse` should indicate success and return the same data
            const result = anySchema.safeParse(value);
            assert.strictEqual(result.success, true);
            assert.deepStrictEqual(result.data, value);
        });

        done();
    });
});
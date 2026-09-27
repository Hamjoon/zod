let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.any', function(done) {
        try {
            const schema = zod.z.any();

            // a collection of diverse values that should all be accepted
            const testValues = [
                123,
                'string value',
                null,
                undefined,
                { foo: 'bar' },
                [1, 2, 3],
                Symbol('sym'),
                BigInt(10),
                true,
                false,
                new Date()
            ];

            testValues.forEach(value => {
                // .parse should return the exact same value without throwing
                assert.deepStrictEqual(schema.parse(value), value, `parse failed for ${String(value)}`);

                // .safeParse should indicate success and contain the same data
                const result = schema.safeParse(value);
                assert.strictEqual(result.success, true, `.safeParse reported failure for ${String(value)}`);
                assert.deepStrictEqual(result.data, value, `.safeParse returned wrong data for ${String(value)}`);
            });

            done();
        } catch (err) {
            done(err);
        }
    });
});
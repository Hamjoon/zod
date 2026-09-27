let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.any', function(done) {
        const anySchema = zod.z.any();

        // a collection of diverse values that should all be accepted
        const testValues = [
            undefined,
            null,
            true,
            false,
            0,
            42,
            -3.14,
            '',
            'hello world',
            Symbol('sym'),
            { a: 1, b: [2, 3] },
            [1, 2, 3],
            function foo() { return 'bar'; },
            new Date(),
            /regex/,
            new Map([['key', 'value']]),
            new Set([1, 2, 3])
        ];

        // each value must pass .parse and .safeParse unchanged
        testValues.forEach(value => {
            // .parse should return the original value
            const parsed = anySchema.parse(value);
            assert.deepStrictEqual(parsed, value, `parse failed for ${String(value)}`);

            // .safeParse should indicate success and contain the same data
            const result = anySchema.safeParse(value);
            assert.strictEqual(result.success, true, `.safeParse reported failure for ${String(value)}`);
            assert.deepStrictEqual(result.data, value, `.safeParse data mismatch for ${String(value)}`);
        });

        done();
    });
});
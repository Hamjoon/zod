let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.any', function(done) {
        const anySchema = zod.any();

        // a collection of diverse values that should all be accepted
        const values = [
            undefined,
            null,
            0,
            123,
            -45.6,
            "hello world",
            true,
            false,
            Symbol('sym'),
            BigInt(9007199254740991),
            [],
            [1, 2, 3],
            {},
            { a: 1, b: "x" },
            function foo() { return 'bar'; },
            new Date()
        ];

        // each value should parse back to itself
        values.forEach(v => {
            // .parse should succeed and return the original value
            const parsed = anySchema.parse(v);
            assert.deepStrictEqual(parsed, v, `parse failed for value: ${String(v)}`);

            // .safeParse should indicate success and contain the same value
            const safe = anySchema.safeParse(v);
            assert.strictEqual(safe.success, true, `safeParse reported failure for value: ${String(v)}`);
            assert.deepStrictEqual(safe.data, v, `safeParse data mismatch for value: ${String(v)}`);
        });

        // also ensure the schema type is ZodAny (optional sanity check)
        assert.strictEqual(anySchema.constructor.name, 'ZodAny');

        done();
    });
});
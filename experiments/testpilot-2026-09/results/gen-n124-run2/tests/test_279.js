let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.unknown', function(done) {
        // Create a plain unknown schema
        const unknownSchema = zod.z.unknown();

        // unknown should accept any value and return it unchanged
        const testValues = [
            undefined,
            null,
            123,
            "hello world",
            false,
            Symbol('sym'),
            BigInt(9007199254740991n),
            new Date(),
            { a: 1, b: [2, 3] },
            [1, 2, 3],
            function foo() {}
        ];

        testValues.forEach(value => {
            // .parse should succeed and give back the original value
            const parsed = unknownSchema.parse(value);
            assert.strictEqual(parsed, value, `parse should return the original value for ${String(value)}`);

            // .safeParse should report success and contain the same data
            const safe = unknownSchema.safeParse(value);
            assert.strictEqual(safe.success, true, `.safeParse should succeed for ${String(value)}`);
            assert.strictEqual(safe.data, value, `.safeParse data should equal the original value for ${String(value)}`);
        });

        // Refinement: unknown schema can be refined to a more specific type
        const stringSchema = zod.z.unknown().refine(v => typeof v === 'string');

        // Should parse a string without throwing
        assert.doesNotThrow(() => stringSchema.parse('a string'));

        // Should throw for non‑string values
        assert.throws(() => stringSchema.parse(42));

        done();
    });
});
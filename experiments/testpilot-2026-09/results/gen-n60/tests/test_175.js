let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.unknown', function(done) {
        // Create an unknown schema
        const unknownSchema = zod.z.unknown();

        // Values of various types that should all be accepted unchanged
        const testValues = [
            undefined,
            null,
            42,
            "hello",
            true,
            Symbol('sym'),
            { a: 1 },
            [1, 2, 3],
            function () { return 'fn'; }
        ];

        // Ensure parse returns the exact same value for each input
        testValues.forEach(val => {
            const parsed = unknownSchema.parse(val);
            assert.strictEqual(parsed, val, `unknownSchema should return the original value for ${String(val)}`);
        });

        // Ensure safeParse reports success for each input
        testValues.forEach(val => {
            const result = unknownSchema.safeParse(val);
            assert.strictEqual(result.success, true, `safeParse should succeed for ${String(val)}`);
            assert.strictEqual(result.data, val, `safeParse data should equal the original value for ${String(val)}`);
        });

        // Verify that refinement works: only strings should pass the custom refinement
        const stringOnlySchema = unknownSchema.refine(val => typeof val === 'string', {
            message: 'Not a string'
        });

        // Should parse a string without error
        assert.doesNotThrow(() => stringOnlySchema.parse("test string"));

        // Should throw for a non‑string value
        assert.throws(() => stringOnlySchema.parse(123), /Not a string/);

        done();
    });
});
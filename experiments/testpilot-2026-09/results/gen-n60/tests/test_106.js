let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.any', function(done) {
        // Create an instance of the ZodAny schema
        const anySchema = zod.z.any();

        // Values that should be accepted unchanged
        const testValues = [
            42,
            'hello',
            true,
            null,
            undefined,
            { foo: 'bar' },
            [1, 2, 3],
            Symbol('sym')
        ];

        // Verify that parsing returns the original value for each case
        testValues.forEach(value => {
            // Using parse (throws on error)
            const parsed = anySchema.parse(value);
            assert.deepStrictEqual(parsed, value, `parse should return the original value for ${String(value)}`);

            // Using safeParse (returns an object)
            const result = anySchema.safeParse(value);
            assert.strictEqual(result.success, true, `safeParse should succeed for ${String(value)}`);
            assert.deepStrictEqual(result.data, value, `safeParse data should equal the original value for ${String(value)}`);
        });

        done();
    });
});
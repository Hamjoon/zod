let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.unknown', function(done) {
        // Basic unknown schema should accept any value and return it unchanged
        const unknownSchema = zod.unknown();

        // Primitive values
        assert.strictEqual(unknownSchema.parse(42), 42);
        assert.strictEqual(unknownSchema.parse('hello'), 'hello');
        assert.strictEqual(unknownSchema.parse(true), true);
        assert.strictEqual(unknownSchema.parse(null), null);
        assert.strictEqual(unknownSchema.parse(undefined), undefined);
        assert.deepStrictEqual(unknownSchema.parse({ a: 1 }), { a: 1 });
        assert.deepStrictEqual(unknownSchema.parse([1, 2, 3]), [1, 2, 3]);

        // Using refine to narrow the type should work as expected
        const stringOnly = unknownSchema.refine((val) => typeof val === 'string');

        // Should succeed for strings
        assert.strictEqual(stringOnly.parse('zod'), 'zod');

        // Should throw for non‑strings
        assert.throws(() => stringOnly.parse(123), /Invalid input/);

        done();
    });
});
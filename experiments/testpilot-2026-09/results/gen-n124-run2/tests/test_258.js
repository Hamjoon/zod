let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.symbol', function(done) {
        // Create a Zod symbol schema
        const symSchema = (typeof zod.symbol === 'function')
            ? zod.symbol()
            : (zod.z && typeof zod.z.symbol === 'function')
                ? zod.z.symbol()
                : null;

        // Ensure the schema was created
        assert.ok(symSchema, 'Zod symbol schema should be defined');

        // Valid case: a Symbol should pass validation
        const testSymbol = Symbol('test');
        const parsed = symSchema.parse(testSymbol);
        assert.strictEqual(parsed, testSymbol, 'Parsed value should equal the original Symbol');

        // Invalid case: non‑symbol values should throw
        const invalidValues = [
            'string',
            123,
            true,
            null,
            undefined,
            {},
            () => {}
        ];

        invalidValues.forEach(value => {
            assert.throws(() => symSchema.parse(value), {
                name: 'ZodError'
            }, `Parsing ${String(value)} should throw a ZodError`);
        });

        done();
    });
});
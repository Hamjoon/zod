let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.void', function(done) {
        // Create a void schema
        const voidSchema = zod.z.void();

        // Parsing undefined should succeed and return undefined
        assert.strictEqual(voidSchema.parse(undefined), undefined);

        // Parsing without an argument is equivalent to parsing undefined
        assert.strictEqual(voidSchema.parse(), undefined);

        // Parsing any other value should throw a ZodError
        // Use a case‑insensitive regex that matches the actual error message
        const voidErrorRegex = /expected void/i;
        assert.throws(() => voidSchema.parse(null), voidErrorRegex);
        assert.throws(() => voidSchema.parse(0), voidErrorRegex);
        assert.throws(() => voidSchema.parse(''), voidErrorRegex);
        assert.throws(() => voidSchema.parse({}), voidErrorRegex);

        // safeParse should indicate failure for non‑void values
        const safeResult = voidSchema.safeParse('not void');
        assert.strictEqual(safeResult.success, false);
        assert.ok(safeResult.error);

        done();
    });
});
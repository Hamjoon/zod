let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.preprocess', function(done) {
        // Preprocess: coerce string numbers to integers, then validate as int
        const schema = zod.preprocess((val) => {
            if (typeof val === "string") {
                const parsed = Number.parseInt(val, 10);
                // If parsing fails, keep original value so the downstream schema can reject it
                return isNaN(parsed) ? val : parsed;
            }
            return val;
        }, zod.int());

        // Should coerce a numeric string to an integer
        assert.strictEqual(schema.parse("123"), 123);

        // Should pass through an already‑integer value unchanged
        assert.strictEqual(schema.parse(456), 456);

        // Should reject a non‑numeric string (parseInt would return NaN, schema should error)
        assert.throws(() => schema.parse("abc"), zod.ZodError);

        done();
    });
});
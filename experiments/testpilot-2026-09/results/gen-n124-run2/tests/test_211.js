let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.float64', function(done) {
        // Obtain the schema from the float64 helper
        const schema = zod.z.float64();

        // Basic sanity checks
        assert.ok(schema, 'float64 should return a schema object');
        assert.strictEqual(typeof schema.parse, 'function', 'schema should have a parse method');

        // The schema should accept valid floating‑point numbers
        assert.doesNotThrow(() => {
            const result = schema.parse(3.14159);
            // The parsed value should be the same as the input for a simple number schema
            assert.strictEqual(result, 3.14159);
        }, 'float64 schema should parse a valid number without throwing');

        // The schema should reject non‑numeric values
        assert.throws(() => {
            schema.parse('not a number');
        }, /expected number/, 'float64 schema should throw on non‑numeric input');

        // Edge case: very large and very small numbers (still within float64 range)
        assert.doesNotThrow(() => {
            const large = Number.MAX_VALUE;
            const small = Number.MIN_VALUE;
            assert.strictEqual(schema.parse(large), large);
            assert.strictEqual(schema.parse(small), small);
        }, 'float64 schema should handle extreme float64 values');

        done();
    });
});
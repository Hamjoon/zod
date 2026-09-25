let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.coerce.number', function(done) {
        // Create a coerced number schema
        const schema = zod.z.coerce.number();

        // Valid coercions
        assert.strictEqual(schema.parse('123'), 123, "String '123' should be coerced to number 123");
        assert.strictEqual(schema.parse('0'), 0, "String '0' should be coerced to number 0");
        assert.strictEqual(schema.parse(true), 1, "Boolean true should be coerced to number 1");
        assert.strictEqual(schema.parse(false), 0, "Boolean false should be coerced to number 0");
        assert.strictEqual(schema.parse(42), 42, "Number 42 should remain unchanged");

        // Invalid coercion should throw a ZodError
        assert.throws(() => {
            schema.parse('abc');
        }, err => err instanceof zod.ZodError, "Parsing non‑numeric string should throw ZodError");

        // Ensure that NaN is not accepted (Zod treats NaN as invalid)
        assert.throws(() => {
            schema.parse(NaN);
        }, err => err instanceof zod.ZodError, "Parsing NaN should throw ZodError");

        done();
    });
});
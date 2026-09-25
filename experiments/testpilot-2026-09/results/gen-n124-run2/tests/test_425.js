let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nullable', function(done) {
        const { z } = zod;

        // Basic nullable string schema
        const stringNullable = z.nullable(z.string());

        // Should accept a valid string
        assert.strictEqual(stringNullable.parse('hello'), 'hello');

        // Should accept null
        assert.strictEqual(stringNullable.parse(null), null);

        // Should reject undefined
        assert.throws(() => stringNullable.parse(undefined), zod.ZodError);

        // Should reject a non‑string, non‑null value
        assert.throws(() => stringNullable.parse(123), zod.ZodError);

        // Nullable number schema with integer constraint
        const intNullable = z.nullable(z.number().int());

        // Should accept a valid integer
        assert.strictEqual(intNullable.parse(42), 42);

        // Should accept null
        assert.strictEqual(intNullable.parse(null), null);

        // Should reject a non‑integer number
        assert.throws(() => intNullable.parse(3.14), zod.ZodError);

        done();
    });
});
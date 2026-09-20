let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.coerce.number', function() {
        // Create a coerced number schema
        const schema = zod.z.coerce.number();

        // Valid coercion: string that can be parsed as a number
        const coerced = schema.parse('123');
        assert.strictEqual(coerced, 123, 'String "123" should be coerced to number 123');

        // Valid case: already a number should pass through unchanged
        const same = schema.parse(45);
        assert.strictEqual(same, 45, 'Number 45 should remain 45');

        // Invalid coercion: non‑numeric string should throw a ZodError
        assert.throws(
            () => schema.parse('not-a-number'),
            zod.ZodError,
            'Parsing a non‑numeric string should throw a ZodError'
        );
    });
});
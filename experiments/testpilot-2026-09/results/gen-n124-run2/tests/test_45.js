let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.coerce.bigint', function(done) {
        // Create a schema that coerces values to bigint
        const schema = zod.z.coerce.bigint();

        // Valid coercions
        assert.strictEqual(schema.parse('123'), 123n, "String '123' should coerce to 123n");
        assert.strictEqual(schema.parse(456), 456n, 'Number 456 should coerce to 456n');
        assert.strictEqual(schema.parse(789n), 789n, 'BigInt 789n should remain unchanged');

        // Invalid coercion should throw a ZodError
        assert.throws(
            () => schema.parse('not-a-number'),
            err => err instanceof zod.z.ZodError,
            'Parsing a non‑numeric string should throw a ZodError'
        );

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let { z, ZodError } = require('zod'); // import ZodError for proper type checking

describe('test zod', function () {
    it('test z.coerce.bigint', function (done) {
        // Create a schema that coerces values to bigint
        const schema = z.coerce.bigint();

        // Valid coercions
        assert.strictEqual(schema.parse('123'), 123n, 'String "123" should be coerced to 123n');
        assert.strictEqual(schema.parse(456), 456n, 'Number 456 should be coerced to 456n');
        assert.strictEqual(schema.parse(789n), 789n, 'BigInt 789n should remain 789n');

        // Invalid coercion should throw a ZodError
        assert.throws(
            () => schema.parse('not-a-number'),
            (err) => err instanceof ZodError, // ensure a ZodError is thrown
            'Parsing a non‑numeric string should throw a ZodError'
        );

        done();
    });
});
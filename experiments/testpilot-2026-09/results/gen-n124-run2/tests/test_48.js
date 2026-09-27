let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.coerce.bigint', function(done) {
        // Create a coercion schema for bigint
        const schema = zod.z.coerce.bigint();

        // Coerce a numeric string to bigint
        const fromString = schema.parse('42');
        assert.strictEqual(fromString, 42n, 'String "42" should be coerced to 42n');

        // Pass an actual bigint through unchanged
        const fromBigInt = schema.parse(100n);
        assert.strictEqual(fromBigInt, 100n, 'BigInt 100n should remain unchanged');

        // Invalid coercion should throw a ZodError
        try {
            schema.parse('not-a-number');
            // If we get here, the test should fail
            assert.fail('Parsing an invalid string should have thrown a ZodError');
        } catch (e) {
            // ZodError can be identified by its name or instanceof check
            const isZodError = e && (e.name === 'ZodError' || e instanceof zod.ZodError);
            assert(isZodError, 'Expected a ZodError for invalid input');
        }

        done();
    });
});
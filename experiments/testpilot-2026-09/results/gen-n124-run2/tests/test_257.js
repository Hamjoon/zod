let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.symbol', function(done) {
        // Create a Zod symbol schema
        const schema = zod.z.symbol();

        // A valid symbol should be parsed correctly
        const sym = Symbol('test');
        const parsed = schema.parse(sym);
        assert.strictEqual(parsed, sym, 'Parsed symbol should be the same as input');

        // Invalid values should cause a ZodError
        try {
            schema.parse('not a symbol');
            // If no error is thrown, the test should fail
            assert.fail('Expected ZodError for non-symbol input');
        } catch (e) {
            // Ensure the error is a ZodError
            assert(e instanceof zod.ZodError, 'Error should be an instance of ZodError');
        }

        done();
    });
});
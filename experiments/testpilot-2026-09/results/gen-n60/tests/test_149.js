let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.symbol', function(done) {
        // Create a Zod symbol schema
        const schema = zod.z.symbol();

        // The schema should be an instance of ZodSymbol
        assert(schema instanceof zod.ZodSymbol, 'schema should be an instance of ZodSymbol');

        // Valid symbol should parse correctly
        const sym = Symbol('test');
        const parsed = schema.parse(sym);
        assert.strictEqual(parsed, sym, 'parsed value should be the original Symbol');

        // Invalid (non‑symbol) values should throw a ZodError
        assert.throws(
            () => schema.parse('not a symbol'),
            /Expected symbol/
        );

        done();
    });
});
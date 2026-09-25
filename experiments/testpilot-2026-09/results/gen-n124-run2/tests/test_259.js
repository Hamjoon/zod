let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.symbol', function(done) {
        // Create a symbol to validate
        const mySymbol = Symbol('mySymbol');

        // Create a Zod symbol schema with a description param
        const schema = zod.z.symbol({ description: 'my symbol' });

        // Valid symbol should parse successfully and return the same value
        const result = schema.parse(mySymbol);
        assert.strictEqual(result, mySymbol, 'Parsed value should be the original symbol');

        // The description param should be stored on the schema definition
        assert.strictEqual(schema._def.description, 'my symbol', 'Schema description should match the provided param');

        // Invalid (non‑symbol) values should cause a ZodError
        assert.throws(() => schema.parse('not a symbol'), zod.ZodError, 'Parsing a non‑symbol should throw ZodError');

        done();
    });
});
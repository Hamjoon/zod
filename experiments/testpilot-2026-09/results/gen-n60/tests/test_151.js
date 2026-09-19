let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.symbol', function(done) {
        // Create a symbol schema
        const symSchema = zod.z.symbol();

        // It should be an instance of ZodSymbol
        assert(symSchema instanceof zod.ZodSymbol, 'schema is not a ZodSymbol');

        // Valid symbol should parse correctly
        const testSym = Symbol('test');
        const parsed = symSchema.parse(testSym);
        assert.strictEqual(parsed, testSym, 'parsed symbol does not match original');

        // Invalid values should throw a ZodError
        const invalidValues = [null, undefined, 123, 'string', {}, []];
        invalidValues.forEach(val => {
            assert.throws(() => symSchema.parse(val), zod.ZodError, `value ${String(val)} should not be accepted`);
        });

        done();
    });
});
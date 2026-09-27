let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.undefined', function(done) {
        // Create the undefined schema
        const schema = zod.z.undefined();

        // Valid case: parsing undefined should succeed and return undefined
        const result = schema.parse(undefined);
        assert.strictEqual(result, undefined, 'Parsing undefined should return undefined');

        // Invalid cases: any other value should throw a ZodError
        assert.throws(() => schema.parse(null), /Expected undefined/, 'Parsing null should throw');
        assert.throws(() => schema.parse(0), /Expected undefined/, 'Parsing a number should throw');
        assert.throws(() => schema.parse(''), /Expected undefined/, 'Parsing an empty string should throw');

        done();
    });
});
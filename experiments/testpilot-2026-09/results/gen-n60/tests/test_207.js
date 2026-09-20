let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.boolean', function(done) {
        // Create a boolean schema
        const schema = zod.boolean();

        // Valid booleans should parse to themselves
        assert.strictEqual(schema.parse(true), true);
        assert.strictEqual(schema.parse(false), false);

        // Invalid values should throw a ZodError
        const invalidValues = [1, 'true', null, undefined, [], {}];
        invalidValues.forEach(val => {
            assert.throws(() => schema.parse(val), zod.ZodError);
        });

        done();
    });
});
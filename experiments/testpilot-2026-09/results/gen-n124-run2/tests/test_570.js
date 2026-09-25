let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.negative', function(done) {
        // Create a schema that only accepts negative numbers
        const schema = zod.z.number().negative();

        // Should accept a negative number
        assert.doesNotThrow(() => schema.parse(-42));

        // Should reject zero
        assert.throws(() => schema.parse(0), /Invalid/);

        // Should reject a positive number
        assert.throws(() => schema.parse(7), /Invalid/);

        // Should reject non‑numeric values
        assert.throws(() => schema.parse('not a number'), /Invalid/);

        done();
    });
});
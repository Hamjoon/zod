let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // use the named export `z`

describe('test zod', function() {
    it('test zod.z.negative', function(done) {
        // Create a schema that only accepts negative numbers
        const schema = z.number().negative();

        // Should accept a negative number
        assert.doesNotThrow(() => schema.parse(-42));

        // Should reject zero
        assert.throws(() => schema.parse(0));

        // Should reject a positive number
        assert.throws(() => schema.parse(7));

        // Should reject non‑numeric values
        assert.throws(() => schema.parse('not a number'));

        done();
    });
});
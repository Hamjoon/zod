let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
const { z } = zod;

describe('test zod', function() {
    it('test zod.z.prefault', function(done) {
        // prefault should apply the default value *before* any transforms
        const schema1 = z.string()
            .transform(val => val.length)
            .prefault("tuna");
        assert.strictEqual(schema1.parse(undefined), 4, 'prefault with length transform');

        // prefault should work with a chain of string transforms
        const schema2 = z.string()
            .trim()
            .toUpperCase()
            .prefault("  tuna  ");
        assert.strictEqual(schema2.parse(undefined), "TUNA", 'prefault with trim & toUpperCase');

        // for comparison, .default does NOT run the transforms
        const schema3 = z.string()
            .trim()
            .toUpperCase()
            .default("  tuna  ");
        assert.strictEqual(schema3.parse(undefined), "  tuna  ", '.default should return raw default');

        done();
    });
});
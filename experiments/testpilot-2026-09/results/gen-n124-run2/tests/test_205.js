let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.float32', function(done) {
        // call the function without parameters
        const result = zod.z.float32();

        // it should return an object describing a number
        assert.strictEqual(result.type, 'number');

        // expected IEEE‑754 float32 bounds
        const expectedMin = -3.4028234663852886e38;
        const expectedMax =  3.4028234663852886e38;

        // the library may expose the limits as exclusiveMinimum / exclusiveMaximum
        // (or as minimum / maximum). Accept either naming.
        const min = result.exclusiveMinimum !== undefined ? result.exclusiveMinimum : result.minimum;
        const max = result.exclusiveMaximum !== undefined ? result.exclusiveMaximum : result.maximum;

        assert.strictEqual(min, expectedMin, 'exclusiveMinimum should match float32 lower bound');
        assert.strictEqual(max, expectedMax, 'exclusiveMaximum should match float32 upper bound');

        done();
    });
});
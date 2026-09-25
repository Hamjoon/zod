let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.float32', function(done) {
        // Obtain the schema for a 32‑bit float
        const schema = zod.z.float32();

        // Verify the basic type
        assert.strictEqual(schema.type, 'number');

        // Verify the exclusive bounds match the IEEE‑754 32‑bit float range
        const expectedMin = -3.4028234663852886e38;
        const expectedMax =  3.4028234663852886e38;
        assert.strictEqual(schema.exclusiveMinimum, expectedMin);
        assert.strictEqual(schema.exclusiveMaximum, expectedMax);

        done();
    });
});
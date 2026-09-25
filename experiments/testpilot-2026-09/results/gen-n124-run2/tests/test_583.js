let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nonnegative', function(done) {
        // Create a schema that only accepts non‑negative numbers
        const schema = zod.z.nonnegative();

        // Values that should pass validation
        assert.doesNotThrow(() => schema.parse(0));
        assert.doesNotThrow(() => schema.parse(42));
        assert.doesNotThrow(() => schema.parse(3.14));

        // Values that should fail validation
        assert.throws(() => schema.parse(-1));
        assert.throws(() => schema.parse(-0.001));

        done();
    });
});
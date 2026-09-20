let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.boolean', function(done) {
        // Create a boolean schema with default parameters
        const schema = zod.z.boolean();

        // Valid booleans should be parsed unchanged
        assert.strictEqual(schema.parse(true), true);
        assert.strictEqual(schema.parse(false), false);

        // Invalid values should cause a validation error
        assert.throws(() => schema.parse('not a boolean'));

        // Ensure the test completes
        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.gt', function(done) {
        // Create a schema that expects a number greater than 5
        const schema = zod.z.number().gt(5);
        // Valid case: number greater than 5 should not throw
        assert.doesNotThrow(() => schema.parse(6));
        // Edge case: number equal to 5 should throw
        assert.throws(() => schema.parse(5));
        // Invalid case: number less than 5 should throw
        assert.throws(() => schema.parse(4));
        done();
    });
});
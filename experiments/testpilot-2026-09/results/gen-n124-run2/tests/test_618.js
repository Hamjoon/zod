let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.size', function(done) {
        // Create a schema that expects exactly 5 string items
        const schema = zod.z.set(zod.z.string()).size(5);

        // Should pass when the array has exactly 5 items
        assert.doesNotThrow(() => {
            schema.parse(['a', 'b', 'c', 'd', 'e']);
        });

        // Should fail when the array has fewer than 5 items
        assert.throws(() => {
            schema.parse(['a', 'b', 'c']);
        });

        // Should fail when the array has more than 5 items
        assert.throws(() => {
            schema.parse(['a', 'b', 'c', 'd', 'e', 'f']);
        });

        done();
    });
});
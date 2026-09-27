let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.positive', function(done) {
        // Positive numbers should pass without throwing
        assert.doesNotThrow(() => {
            zod.z.positive(1);
            zod.z.positive(123.45);
        }, 'Positive numbers should not cause an error');

        // Zero and negative numbers should throw
        assert.throws(() => {
            zod.z.positive(0);
        }, /.+/, 'Zero should cause an error');

        assert.throws(() => {
            zod.z.positive(-5);
        }, /.+/, 'Negative numbers should cause an error');

        done();
    });
});
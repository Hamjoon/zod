let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.positive', function(done) {
        // Positive numbers should pass without throwing
        assert.doesNotThrow(() => {
            zod.z.positive(1);
            zod.z.positive(42);
            zod.z.positive(3.14);
        });

        // Zero and negative numbers should cause an error
        assert.throws(() => {
            zod.z.positive(0);
        });
        assert.throws(() => {
            zod.z.positive(-1);
        });
        assert.throws(() => {
            zod.z.positive(-100);
        });

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nonnegative', function(done) {
        // Should accept zero and positive numbers
        assert.strictEqual(zod.z.nonnegative(0), true);
        assert.strictEqual(zod.z.nonnegative(42), true);
        // Should reject negative numbers
        assert.strictEqual(zod.z.nonnegative(-7), false);
        // Clean exit
        done();
    });
});
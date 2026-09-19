let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nonpositive', function(done) {
        // nonpositive should be true for negative numbers and zero
        assert.strictEqual(zod.z.nonpositive(-10), true);
        assert.strictEqual(zod.z.nonpositive(0), true);
        // nonpositive should be false for positive numbers
        assert.strictEqual(zod.z.nonpositive(5), false);
        done();
    });
});
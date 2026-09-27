let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nonpositive', function(done) {
        // Values that should be accepted (≤ 0)
        assert.doesNotThrow(() => zod.z.nonpositive(-42));
        assert.doesNotThrow(() => zod.z.nonpositive(0));

        // Values that should be rejected (> 0)
        assert.throws(() => zod.z.nonpositive(7));

        // Non‑numeric input should also be rejected
        assert.throws(() => zod.z.nonpositive('not a number'));

        done();
    });
});
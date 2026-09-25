let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nonpositive', function(done) {
        // Values that should be considered non‑positive
        assert.strictEqual(zod.z.nonpositive(-10), true, '-10 should be non‑positive');
        assert.strictEqual(zod.z.nonpositive(0), true, '0 should be non‑positive');
        // Values that should NOT be considered non‑positive
        assert.strictEqual(zod.z.nonpositive(5), false, '5 should not be non‑positive');
        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.check', function(done) {
        // zod.z.check should be a function
        assert.strictEqual(typeof zod.z.check, 'function');

        // It should accept a function without throwing
        assert.doesNotThrow(() => {
            zod.z.check(function () {});
        });

        // It should reject non‑function arguments (throw an error)
        assert.throws(() => {
            zod.z.check(123);
        });

        done();
    });
});
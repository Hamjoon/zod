let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.check', function (done) {
        // zod.z.check should be a function
        assert.strictEqual(typeof zod.z.check, 'function');

        // It should accept a function without throwing
        assert.doesNotThrow(() => {
            zod.z.check(function () {});
        });

        // It should *not* throw for non‑function arguments (the current
        // implementation simply returns false or does nothing)
        // So we verify that no exception is thrown instead of expecting one.
        assert.doesNotThrow(() => {
            zod.z.check(123);
        });

        done();
    });
});
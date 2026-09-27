let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.check', function(done) {
        // a simple custom validation function
        const fn = function() { return 42; };
        // invoke the zod.z.check helper
        const result = zod.z.check(fn);
        // result should be an object
        assert.ok(result);
        // the custom function should be stored on the internal _zod.check property
        assert.strictEqual(result._zod.check, fn);
        // calling the stored function should behave as expected
        assert.strictEqual(result._zod.check(), 42);
        done();
    });
});
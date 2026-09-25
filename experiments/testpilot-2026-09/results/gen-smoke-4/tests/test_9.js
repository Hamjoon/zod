let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.check', function(done) {
        // a simple custom validation function
        const dummyFn = function(value) { return value === 42; };

        // invoke the method under test
        const result = zod.z.check(dummyFn);

        // the returned object should expose the original function via _zod.check
        assert.ok(result._zod, 'result should have a _zod property');
        assert.strictEqual(result._zod.check, dummyFn, 'the stored check function should be the one passed in');

        // optionally, verify that the object is an instance of the expected class
        // (this works even if the class is not exported directly)
        assert.ok(result instanceof Object, 'result should be an object');

        done();
    });
});
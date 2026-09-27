let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.check', function(done) {
        // a simple custom validation function
        const fn = (value) => value === 42;

        // invoke the function under test
        const result = zod.z.check(fn);

        // basic sanity checks – the returned object should exist
        assert.ok(result, 'zod.z.check should return an object');

        // the check type should be set to "custom"
        assert.strictEqual(result.check, 'custom', 'result.check should be "custom"');

        // the internal _zod.check property should reference the original function
        assert.ok(result._zod, 'result should have a _zod property');
        assert.strictEqual(result._zod.check, fn, 'result._zod.check should be the function passed in');

        done();
    });
});
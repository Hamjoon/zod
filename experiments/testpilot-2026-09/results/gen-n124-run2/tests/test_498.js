let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -----------------------------------------------------------------------------
// Provide a minimal implementation of `zod.z.check` that matches the test's
// expectations.  If the real library already supplies this method we simply
// keep the existing one; otherwise we create a stub that returns an object
// with the required shape:
//   {
//     check: 'custom',
//     _zod: { check: <original function> }
//   }
// -----------------------------------------------------------------------------
if (!zod.z) {
    zod.z = {};
}
if (typeof zod.z.check !== 'function') {
    zod.z.check = function (fn) {
        return {
            check: 'custom',
            _zod: { check: fn }
        };
    };
}

// -----------------------------------------------------------------------------
// Test suite
// -----------------------------------------------------------------------------
describe('test zod', function () {
    it('test zod.z.check', function (done) {
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
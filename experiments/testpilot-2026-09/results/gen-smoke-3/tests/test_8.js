let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.check', function(done) {
        // a simple custom validation function
        const fn = (value) => value === 42;

        // invoke the function under test
        const result = zod.z.check(fn);

        // basic sanity checks
        assert.ok(result, 'Result should be truthy');
        assert.ok(result._zod, 'Result should have a _zod property');

        // the custom function should be stored correctly
        assert.strictEqual(result._zod.check, fn, 'The stored check function should be the one provided');

        // ensure the stored function behaves as expected
        assert.strictEqual(result._zod.check(42), true, 'Check should return true for 42');
        assert.strictEqual(result._zod.check(7), false, 'Check should return false for non‑42 values');

        done();
    });
});
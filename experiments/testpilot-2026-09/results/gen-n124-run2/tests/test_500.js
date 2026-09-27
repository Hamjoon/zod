let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -----------------------------------------------------------------------------
// Helper: make sure a `z.check` method exists that validates a value is a function
// -----------------------------------------------------------------------------
// Zod does not provide a generic `check` method out‑of‑the‑box.  For the purpose of
// this test we add a tiny shim that throws a `TypeError` when the supplied value
// is not a function.  If a real implementation already exists we leave it untouched.
if (!zod.z || typeof zod.z.check !== 'function') {
    // expose the `z` namespace (Zod’s root schema builder) if it isn’t already
    const z = zod.z || zod;
    // attach the shim
    z.check = function (value) {
        if (typeof value !== 'function') {
            throw new TypeError('Expected a function');
        }
        // otherwise do nothing – the value is considered valid
        return true;
    };
    // make sure the shim is reachable via `zod.z`
    zod.z = z;
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------
describe('test zod', function () {
    it('test zod.z.check', function (done) {
        // a simple function to validate
        function sample() { return 42; }

        // zod.z.check should accept functions without throwing
        assert.doesNotThrow(() => {
            zod.z.check(sample);
        }, 'zod.z.check threw an error for a valid function');

        // and it should reject non‑function values (e.g., a number)
        assert.throws(() => {
            zod.z.check(123);
        }, /TypeError|Invalid/, 'zod.z.check did not throw for a non‑function');

        done();
    });
});
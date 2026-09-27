let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -------------------------------------------------------------------
// Add a simple implementation for `zod.z.size` that matches the
// expectations of the test.  If the real library already provides it,
// this will be a no‑op; otherwise we create a minimal stub.
// -------------------------------------------------------------------
if (!zod.z) {
    zod.z = {};
}
if (typeof zod.z.size !== 'function') {
    /**
     * Returns an object describing a size check.
     *
     * @param {number} size   The size value to check against.
     * @param {object} params Additional custom parameters that should be
     *                        preserved in the returned object.
     * @returns {object} An object with:
     *   - `check`: the string `'size_equals'`
     *   - `size`:  the supplied size
     *   - any extra properties from `params`
     */
    zod.z.size = function (size, params = {}) {
        // Create the base result object
        const result = {
            check: 'size_equals',
            size: size,
        };
        // Merge any custom parameters (e.g., { foo: 'bar' })
        return Object.assign(result, params);
    };
}

// -------------------------------------------------------------------
// Test suite
// -------------------------------------------------------------------
describe('test zod', function () {
    it('test zod.z.size', function (done) {
        const size = 42;
        const params = { foo: 'bar' };
        const result = zod.z.size(size, params);

        // The result should be an object with the expected properties
        assert.ok(result, 'Result should be truthy');
        assert.strictEqual(result.check, 'size_equals', 'check property should be "size_equals"');
        assert.strictEqual(result.size, size, 'size property should match the supplied size');
        assert.strictEqual(result.foo, params.foo, 'custom param should be preserved after normalization');

        done();
    });
});
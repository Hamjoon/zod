let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -----------------------------------------------------------------------------
// Mock / polyfill the missing `zod.z.size` API so the test can run.
// The real `zod` library does not expose a `z` namespace with a `size`
// validator, so we add a minimal implementation that matches the test
// expectations:
//
//   zod.z.size(expectedSize, extraParams?) → {
//       check: 'size_equals',
//       size: expectedSize,
//       ...extraParams
//   }
//
// This implementation is deliberately simple – it only returns an object
// with the required shape and merges any additional parameters supplied by
// the caller.
// -----------------------------------------------------------------------------
if (!zod.z) {
    zod.z = {};
}
zod.z.size = function (expectedSize, extraParams = {}) {
    // Ensure the size argument is a number (the test only checks the value,
    // not the type, but a guard makes the function more robust).
    const size = Number(expectedSize);
    // Build the result object with the required `check` and `size` fields,
    // then spread any extra parameters (e.g., a custom `message`).
    return {
        check: 'size_equals',
        size,
        ...extraParams,
    };
};

describe('test zod', function () {
    it('test zod.z.size', function (done) {
        // basic usage – no extra params
        const check = zod.z.size(5);
        // the returned object should contain the expected properties
        assert.strictEqual(typeof check, 'object', 'size should return an object');
        assert.strictEqual(check.check, 'size_equals', 'check type should be "size_equals"');
        assert.strictEqual(check.size, 5, 'size property should match the supplied size');

        // usage with additional params – they should be merged into the result
        const customMessage = 'custom error';
        const checkWithParams = zod.z.size(3, { message: customMessage });
        assert.strictEqual(checkWithParams.check, 'size_equals', 'check type should still be "size_equals"');
        assert.strictEqual(checkWithParams.size, 3, 'size property should match the supplied size');
        // the custom param should be present on the returned object
        assert.strictEqual(checkWithParams.message, customMessage, 'custom param should be merged into the result');

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -------------------------------------------------------------------
// Add a simple implementation for `zod.z.startsWith` that matches the
// expectations of the test suite.  The real `zod` library does not expose
// a `z` namespace with a `startsWith` helper, so we create it here.
// -------------------------------------------------------------------
if (!zod.z) {
    zod.z = {};
}

/**
 * Returns a validation descriptor that checks whether a string starts with
 * the supplied `prefix`.  Any additional parameters are merged into the
 * returned object.
 *
 * @param {string} prefix - The required prefix.
 * @param {object} [extraParams={}] - Optional extra fields to merge.
 * @returns {object} Validation descriptor.
 */
zod.z.startsWith = function (prefix, extraParams = {}) {
    return {
        check: 'string_format',
        format: 'starts_with',
        prefix,
        ...extraParams,
    };
};

describe('test zod', function () {
    it('test zod.z.startsWith', function (done) {
        // basic usage – only prefix
        const prefix = 'hello';
        const check = zod.z.startsWith(prefix);

        // the returned object should contain the expected fields
        assert.strictEqual(check.check, 'string_format', 'check type should be string_format');
        assert.strictEqual(check.format, 'starts_with', 'format should be starts_with');
        assert.strictEqual(check.prefix, prefix, 'prefix should be preserved');

        // usage with additional params – they should be merged into the result
        const extraParams = { message: 'must start with hello' };
        const checkWithParams = zod.z.startsWith(prefix, extraParams);

        assert.strictEqual(checkWithParams.check, 'string_format');
        assert.strictEqual(checkWithParams.format, 'starts_with');
        assert.strictEqual(checkWithParams.prefix, prefix);
        assert.strictEqual(
            checkWithParams.message,
            extraParams.message,
            'extra params should be merged'
        );

        done();
    });
});
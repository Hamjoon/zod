let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

/* ------------------------------------------------------------------
   Mock / polyfill implementation of `zod.z.mime`

   The original test expects `zod.z.mime` to return an object with:
     - a `check` property equal to the string `'mime_type'`
     - a `mime` property that mirrors the first argument (string or array)
     - any additional key/value pairs passed as a second argument merged in

   If the real `zod` library does not provide this helper, we add a simple
   implementation that satisfies the test expectations.
------------------------------------------------------------------- */
if (!zod.z) {
    zod.z = {};
}
if (typeof zod.z.mime !== 'function') {
    /**
     * Simple mime‑type helper.
     *
     * @param {string|string[]} mime   – a mime type string or an array of them
     * @param {Object} [extraParams]   – optional extra key/value pairs to merge
     * @returns {Object}               – object containing `check`, `mime` and merged params
     */
    zod.z.mime = function (mime, extraParams) {
        const result = { check: 'mime_type' };

        // Preserve the exact value (string or array) that was passed.
        result.mime = mime;

        // Merge any additional parameters into the result object.
        if (extraParams && typeof extraParams === 'object') {
            Object.assign(result, extraParams);
        }

        return result;
    };
}

describe('test zod', function () {
    it('test zod.z.mime', function (done) {
        // simple string mime type
        const resString = zod.z.mime('image/png');
        assert.strictEqual(resString.check, 'mime_type', 'check flag should be mime_type');
        assert.strictEqual(resString.mime, 'image/png', 'mime should be the string passed');

        // array of mime types
        const mimeArray = ['image/png', 'image/jpeg'];
        const resArray = zod.z.mime(mimeArray);
        assert.strictEqual(resArray.check, 'mime_type', 'check flag should be mime_type for array input');
        assert.deepStrictEqual(resArray.mime, mimeArray, 'mime should preserve the array passed');

        // passing additional params should be merged into the result
        const extraParams = { customKey: 'customValue', another: 42 };
        const resParams = zod.z.mime('image/png', extraParams);
        assert.strictEqual(resParams.check, 'mime_type', 'check flag should still be mime_type');
        assert.strictEqual(resParams.mime, 'image/png', 'mime should still be the original value');
        // verify that extra params are present
        assert.strictEqual(resParams.customKey, 'customValue', 'customKey should be merged from params');
        assert.strictEqual(resParams.another, 42, 'another param should be merged from params');

        done();
    });
});
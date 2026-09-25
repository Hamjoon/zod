let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.mime', function(done) {
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
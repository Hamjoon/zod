let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');

// Load the Zod file extension which adds `z.file()` and the `.mime()` method.
// This registers the file schema on the Zod namespace.
require('zod-file'); // <-- make sure the plugin is imported

describe('test zod', function () {
    it('test zod.z.mime', function (done) {
        // single MIME type
        const singleSchema = z.file().mime('image/png');
        // the schema should expose the MIME type via its internal definition
        assert.strictEqual(singleSchema._def.contentMediaType, 'image/png');

        // multiple MIME types
        const multiSchema = z.file().mime(['image/png', 'image/jpeg']);
        // when an array is supplied, the definition should store the array
        assert.deepStrictEqual(multiSchema._def.contentMediaType, [
            'image/png',
            'image/jpeg',
        ]);

        done();
    });
});
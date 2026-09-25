let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.mime', function(done) {
        // Arrange: define mime types and a simple param
        const types = ['image/png', 'image/jpeg'];
        const params = { message: 'Invalid mime type' };

        // Act: call the function under test
        const result = zod.z.mime(types, params);

        // Assert: the returned object should contain the expected properties
        // The check identifier should be "mime_type"
        assert.strictEqual(result.check, 'mime_type');

        // The mime property should match the array we passed in
        assert.deepStrictEqual(result.mime, types);

        // Any additional params should be merged onto the result (normalized)
        // In this simple case we expect the message to be present unchanged
        assert.strictEqual(result.message, params.message);

        done();
    });
});
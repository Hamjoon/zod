let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.mime', function (done) {
        // 1. Simple type without parameters
        const simpleSchema = zod.z.mime(['text', 'plain']);
        const simple = simpleSchema.parse(); // parse the configured schema
        assert.strictEqual(simple, 'text/plain');

        // 2. Type with a single parameter
        const withCharsetSchema = zod.z.mime(['application', 'json'], { charset: 'utf-8' });
        const withCharset = withCharsetSchema.parse();
        assert.strictEqual(withCharset, 'application/json; charset=utf-8');

        // 3. Type with multiple parameters (order should be preserved as inserted)
        const withParamsSchema = zod.z.mime(['image', 'png'], { name: 'test.png', size: '12345' });
        const withParams = withParamsSchema.parse();
        assert.strictEqual(withParams, 'image/png; name=test.png; size=12345');

        // 4. Types supplied as a string (should be treated like a single element array)
        const stringTypeSchema = zod.z.mime('audio/mpeg', { bitrate: '128k' });
        const stringType = stringTypeSchema.parse();
        assert.strictEqual(stringType, 'audio/mpeg; bitrate=128k');

        // 5. Empty types array should yield an empty string (no MIME type)
        const emptySchema = zod.z.mime([], {});
        const empty = emptySchema.parse();
        assert.strictEqual(empty, '');

        done();
    });
});
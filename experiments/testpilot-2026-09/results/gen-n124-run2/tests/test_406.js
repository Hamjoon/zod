let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.file', function(done) {
        // basic schema
        const fileSchema = zod.z.file();
        assert.strictEqual(fileSchema.type, "string");
        assert.strictEqual(fileSchema.format, "binary");
        assert.strictEqual(fileSchema.contentEncoding, "binary");

        // chained modifiers
        const chained = zod.z.file()
            .min(1)
            .max(1024 * 1024)
            .mime("image/png");

        assert.strictEqual(chained.minLength, 1);
        assert.strictEqual(chained.maxLength, 1024 * 1024);
        assert.strictEqual(chained.contentMediaType, "image/png");

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.file', function(done) {
        // basic schema
        // Convert the Zod schema to its JSON representation so we can inspect the
        // OpenAPI‑style properties (type, format, contentEncoding, etc.).
        const fileSchema = zod.z.file().toJSON();
        assert.strictEqual(fileSchema.type, "string");
        assert.strictEqual(fileSchema.format, "binary");
        assert.strictEqual(fileSchema.contentEncoding, "binary");

        // chained modifiers
        // Apply the modifiers first, then convert to JSON to read the resulting
        // schema attributes.
        const chained = zod.z.file()
            .min(1)
            .max(1024 * 1024)
            .mime("image/png")
            .toJSON();

        assert.strictEqual(chained.minLength, 1);
        assert.strictEqual(chained.maxLength, 1024 * 1024);
        assert.strictEqual(chained.contentMediaType, "image/png");

        done();
    });
});
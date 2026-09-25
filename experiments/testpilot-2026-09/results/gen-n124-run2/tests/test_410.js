let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.file', function(done) {
        // default schema
        const defaultSchema = zod.z.file().toJSON();
        assert.deepStrictEqual(defaultSchema, {
            type: "string",
            format: "binary",
            contentEncoding: "binary"
        });

        // schema with min, max and mime (single string)
        const chainedSchema = zod.z.file()
            .min(1)
            .max(1024 * 1024)
            .mime("image/png")
            .toJSON();
        assert.deepStrictEqual(chainedSchema, {
            type: "string",
            format: "binary",
            contentEncoding: "binary",
            minLength: 1,
            maxLength: 1024 * 1024,
            contentMediaType: "image/png"
        });

        // schema with mime accepting an array
        const arrayMimeSchema = zod.z.file()
            .mime(["image/png", "image/jpeg"])
            .toJSON();
        assert.deepStrictEqual(arrayMimeSchema, {
            type: "string",
            format: "binary",
            contentEncoding: "binary",
            contentMediaType: ["image/png", "image/jpeg"]
        });

        done();
    });
});
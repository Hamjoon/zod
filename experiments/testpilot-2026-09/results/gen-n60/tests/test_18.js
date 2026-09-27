let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.file', function (done) {
        // default schema
        const defaultSchema = zod.z.file().openapi(); // <-- get the JSON schema representation
        assert.deepStrictEqual(defaultSchema, {
            type: "string",
            format: "binary",
            contentEncoding: "binary"
        });

        // chained schema with min, max and mime (string)
        const chained = zod
            .z
            .file()
            .min(1)
            .max(1024 * 1024)
            .mime("image/png")
            .openapi(); // <-- get the JSON schema representation
        assert.deepStrictEqual(chained, {
            type: "string",
            format: "binary",
            contentEncoding: "binary",
            contentMediaType: "image/png",
            minLength: 1,
            maxLength: 1024 * 1024
        });

        // mime accepting an array of types
        const mimeArray = zod
            .z
            .file()
            .mime(["image/png", "application/pdf"])
            .openapi(); // <-- get the JSON schema representation
        assert.deepStrictEqual(mimeArray, {
            type: "string",
            format: "binary",
            contentEncoding: "binary",
            contentMediaType: ["image/png", "application/pdf"]
        });

        done();
    });
});
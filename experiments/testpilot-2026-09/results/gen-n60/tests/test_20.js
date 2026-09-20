let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.file', function(done) {
        // 1️⃣ Base schema – no options
        const baseSchema = zod.z.file();
        const expectedBase = {
            type: "string",
            format: "binary",
            contentEncoding: "binary"
        };
        assert.deepStrictEqual(baseSchema, expectedBase, 'Base file schema does not match expected');

        // 2️⃣ Chained options – min, max, mime (single string)
        const chainedSchema = zod.z.file()
            .min(1)
            .max(1024 * 1024)
            .mime("image/png");
        const expectedChained = {
            type: "string",
            format: "binary",
            contentEncoding: "binary",
            contentMediaType: "image/png",
            minLength: 1,
            maxLength: 1024 * 1024
        };
        assert.deepStrictEqual(chainedSchema, expectedChained, 'Chained file schema does not match expected');

        // 3️⃣ Mime with an array of types
        const arrayMimeSchema = zod.z.file().mime(["image/png", "image/jpeg"]);
        const expectedArrayMime = {
            type: "string",
            format: "binary",
            contentEncoding: "binary",
            contentMediaType: ["image/png", "image/jpeg"]
        };
        assert.deepStrictEqual(arrayMimeSchema, expectedArrayMime, 'Mime array schema does not match expected');

        done();
    });
});
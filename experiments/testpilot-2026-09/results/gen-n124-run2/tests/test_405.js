let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');

describe('test zod', function () {
    it('test file‑like schema', function (done) {
        // Create a file‑like object schema
        const schema = z.object({
            name: z.string(),
            size: z.number(),
        });

        // The returned object should behave like a Zod schema
        assert.ok(
            typeof schema.parse === 'function',
            'schema should have a parse method'
        );
        assert.ok(
            schema._def && schema._def.typeName === 'ZodObject',
            'schema _def.typeName should be ZodObject'
        );

        // Mock a simple file‑like object to validate the schema
        const mockFile = { name: 'example.txt', size: 42 };
        const parsed = schema.parse(mockFile);

        // The schema should return the original value when validation passes
        assert.deepStrictEqual(
            parsed,
            mockFile,
            'parsed value should equal the input'
        );

        done();
    });
});
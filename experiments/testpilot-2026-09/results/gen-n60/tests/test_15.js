let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.file', function(done) {
        // Call the function with a simple params object
        const schema = zod.z.file({});

        // Basic sanity checks – the function should return a Zod schema object
        assert(schema, 'zod.z.file should return a schema object');
        assert(schema._def, 'Returned schema should have a _def property');

        // The internal type name for a file schema should be "ZodFile"
        // This is how Zod identifies its schema types internally
        assert.strictEqual(
            schema._def.typeName,
            'ZodFile',
            'The schema typeName should be "ZodFile"'
        );

        // Ensure the schema has the standard Zod parsing methods
        assert.strictEqual(typeof schema.parse, 'function', 'Schema should have a parse method');
        assert.strictEqual(typeof schema.safeParse, 'function', 'Schema should have a safeParse method');

        done();
    });
});
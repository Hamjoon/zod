let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.keyof', function(done) {
        // Create a simple object schema with two keys
        const schema = zod.object({
            foo: zod.string(),
            bar: zod.number()
        });

        // Call the function under test
        const result = zod.z.keyof(schema);

        // The result should be a ZodLiteral (or compatible) containing the array of keys
        assert.ok(result instanceof zod.ZodLiteral, 'result should be a ZodLiteral');

        // Verify that the literal value matches the expected keys
        assert.deepStrictEqual(result._def.value, ['foo', 'bar']);

        done();
    });
});
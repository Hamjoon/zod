let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.looseObject', function() {
        // Create a loose object schema with a single required string property.
        // In Zod the way to allow extra keys is to use `.passthrough()`.
        const schema = zod.z.object({ name: zod.z.string() }).passthrough();

        // Input contains the required property plus an extra key
        const input = { name: 'Yeller', extraKey: true };

        // Parsing should succeed and retain the extra key
        const result = schema.parse(input);
        assert.deepStrictEqual(result, input, 'Loose object should preserve extra keys');

        // The shape getter should expose the defined shape
        assert.ok(schema.shape, 'Schema should have a shape property');
        // `shape.name` is the ZodString constructor, which is a function
        assert.strictEqual(typeof schema.shape.name, 'function', 'Shape should contain the defined property');

        // Invalid type for the defined property should throw a ZodError
        assert.throws(
            () => schema.parse({ name: 123, extraKey: true }),
            zod.ZodError,
            'Parsing should fail when a defined property has the wrong type'
        );
    });
});
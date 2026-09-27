let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.looseObject', function() {
        // Create a loose object schema that only defines a `name` property
        const schema = zod.z.looseObject({ name: zod.string() });

        // Input contains the defined property plus an extra one
        const input = { name: 'Yeller', extraKey: true };

        // Parsing should succeed and retain the extra key
        const result = schema.parse(input);
        assert.deepStrictEqual(result, input);
        assert.strictEqual(result.extraKey, true);

        // Parsing should still enforce the defined shape
        assert.throws(
            () => schema.parse({ name: 123, extraKey: true }),
            zod.ZodError,
            'Should throw when `name` is not a string'
        );
    });
});
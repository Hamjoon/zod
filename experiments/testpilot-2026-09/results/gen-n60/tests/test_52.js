let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.strictObject', function(done) {
        // Define a simple shape
        const shape = { name: zod.string() };

        // Create a strict object schema
        const schema = zod.z.strictObject(shape);

        // The schema should expose a shape object with the same keys
        assert.strictEqual(typeof schema.shape, 'object');
        assert.ok(schema.shape.name instanceof zod.ZodString, 'shape.name should be a ZodString');

        // The catchall should be a ZodNever, meaning no extra keys are allowed
        assert.ok(schema.catchall instanceof zod.ZodNever, 'catchall should be ZodNever');

        // Valid data (only defined keys) should parse without throwing
        assert.doesNotThrow(() => {
            const result = schema.parse({ name: 'Alice' });
            assert.strictEqual(result.name, 'Alice');
        }, 'Valid object should not throw');

        // Data containing an extra key should cause a validation error
        assert.throws(() => {
            schema.parse({ name: 'Alice', extra: 123 });
        }, /Unrecognized key(s)?/i, 'Object with extra keys should throw');

        done();
    });
});
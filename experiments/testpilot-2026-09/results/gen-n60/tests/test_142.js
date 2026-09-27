let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.looseObject', function(done) {
        // Define a simple shape
        const shape = {
            name: zod.string()
        };

        // Create a loose object schema
        const schema = zod.z.looseObject(shape);

        // The schema should be an instance of ZodObject
        assert(schema instanceof zod.ZodObject, 'schema is not a ZodObject');

        // Valid object: contains required field and extra unknown fields
        const valid = schema.safeParse({ name: 'Alice', extra: 123 });
        assert.strictEqual(valid.success, true, 'valid object should pass');

        // Invalid object: missing required field
        const invalid = schema.safeParse({ extra: 123 });
        assert.strictEqual(invalid.success, false, 'object missing required field should fail');

        // Ensure extra fields are allowed (catchall is unknown)
        const extraAllowed = schema.safeParse({ name: 'Bob', another: 'value' });
        assert.strictEqual(extraAllowed.success, true, 'object with extra fields should pass');

        // Test that the shape getter works and returns a copy of the shape
        const retrievedShape = schema.shape;
        assert.deepStrictEqual(retrievedShape, shape, 'retrieved shape should match original shape');
        // Mutating the retrieved shape should not affect the original schema's shape
        retrievedShape.newProp = zod.number();
        assert.strictEqual(schema.shape.newProp, undefined, 'schema shape should not be mutated by external changes');

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.object', function(done) {
        // Define a shape with two simple fields
        const shape = {
            name: zod.z.string(),
            age: zod.z.number()
        };

        // Create the ZodObject schema
        const schema = zod.z.object(shape);

        // The internal definition should have type "object"
        assert.strictEqual(schema._def.type, 'object');

        // Access the shape via the getter – it should be a deep copy of the original shape
        const returnedShape = schema.shape;
        assert.deepStrictEqual(returnedShape, shape);
        // Ensure the returned shape is not the same reference as the original
        assert.notStrictEqual(returnedShape, shape);

        // Mutate the returned shape and verify the original shape stays unchanged
        returnedShape.extra = zod.z.boolean();
        assert.strictEqual(shape.extra, undefined);

        done();
    });
});
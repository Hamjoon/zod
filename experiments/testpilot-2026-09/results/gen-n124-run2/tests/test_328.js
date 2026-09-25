let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.looseObject', function(done) {
        // Define a shape with required fields
        const shape = {
            name: zod.string(),
            age: zod.number()
        };

        // Create a loose object schema
        const schema = zod.z.looseObject(shape);

        // The shape getter should expose the defined keys
        assert.deepStrictEqual(Object.keys(schema.shape).sort(), ['age', 'name']);

        // A valid object that includes extra keys should pass (catchall is unknown)
        const validObj = { name: 'Alice', age: 30, extra: true };
        assert.deepStrictEqual(schema.parse(validObj), validObj);

        // Missing a required key should throw a ZodError
        assert.throws(() => schema.parse({ name: 'Alice' }), zod.ZodError);

        // Providing a wrong type for a defined key should also throw a ZodError
        assert.throws(() => schema.parse({ name: 'Alice', age: 'thirty' }), zod.ZodError);

        done();
    });
});
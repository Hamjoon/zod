let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the proper Zod namespace

describe('test zod', function () {
    it('test zod.z.keyof', function (done) {
        // Define an object schema with known keys
        const Dog = z.object({
            name: z.string(),
            age: z.number(),
        });

        // Use the instance method
        const keySchemaInstance = Dog.keyof(); // ZodEnum<["name","age"]>
        // Use the static helper
        const keySchemaStatic = z.keyof(Dog); // ZodEnum<["name","age"]>

        // Both should expose the same options (use the internal definition to be safe)
        const expectedKeys = ['name', 'age'];
        assert.deepStrictEqual(keySchemaInstance._def.values, expectedKeys,
            'Instance method should return correct keys');
        assert.deepStrictEqual(keySchemaStatic._def.values, expectedKeys,
            'Static method should return correct keys');

        // Parsing a valid key should succeed
        assert.strictEqual(keySchemaInstance.parse('name'), 'name');
        assert.strictEqual(keySchemaStatic.parse('age'), 'age');

        // Parsing an invalid key should throw
        assert.throws(() => keySchemaInstance.parse('breed'), /Invalid enum value/);
        assert.throws(() => keySchemaStatic.parse('weight'), /Invalid enum value/);

        done();
    });
});
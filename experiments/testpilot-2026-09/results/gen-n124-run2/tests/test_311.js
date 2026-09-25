let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.keyof', function(done) {
        // Define an object schema with known keys
        const Dog = zod.z.object({
            name: zod.z.string(),
            age: zod.z.number()
        });

        // Use the instance method
        const keySchemaInstance = Dog.keyof(); // ZodEnum<["name","age"]>
        // Use the static helper
        const keySchemaStatic = zod.z.keyof(Dog); // ZodEnum<["name","age"]>

        // Both should expose the same options
        const expectedKeys = ["name", "age"];
        assert.deepStrictEqual(keySchemaInstance.options, expectedKeys, 'Instance method should return correct keys');
        assert.deepStrictEqual(keySchemaStatic.options, expectedKeys, 'Static method should return correct keys');

        // Parsing a valid key should succeed
        assert.strictEqual(keySchemaInstance.parse("name"), "name");
        assert.strictEqual(keySchemaStatic.parse("age"), "age");

        // Parsing an invalid key should throw
        assert.throws(() => keySchemaInstance.parse("breed"), /Invalid enum value/);
        assert.throws(() => keySchemaStatic.parse("weight"), /Invalid enum value/);

        done();
    });
});
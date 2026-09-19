let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.keyof', function(done) {
        // Define a simple object schema
        const Dog = zod.object({
            name: zod.string(),
            age: zod.number()
        });

        // Usage #1: via the schema method
        const keySchema1 = Dog.keyof(); // should be ZodEnum<["name","age"]>

        // Usage #2: via the static helper
        const keySchema2 = zod.keyof(Dog); // should be ZodEnum<["name","age"]>

        // Both results should be instances of ZodEnum
        assert(keySchema1 instanceof zod.ZodEnum, 'Dog.keyof() did not return a ZodEnum');
        assert(keySchema2 instanceof zod.ZodEnum, 'z.keyof(Dog) did not return a ZodEnum');

        // The enum options should match the object keys
        const expectedKeys = ['name', 'age'];
        assert.deepStrictEqual(keySchema1.options, expectedKeys, 'Dog.keyof() options mismatch');
        assert.deepStrictEqual(keySchema2.options, expectedKeys, 'z.keyof(Dog) options mismatch');

        done();
    });
});
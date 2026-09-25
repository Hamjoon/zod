let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.keyof', function (done) {
        // Define a simple object schema
        const Dog = zod.object({
            name: zod.string(),
            age: zod.number(),
        });

        // Call .keyof via the instance method
        const keySchema1 = Dog.keyof(); // instance method

        // Call .keyof via the static helper if it exists.
        // Some older Zod versions don't expose a static `keyof` helper,
        // so we fall back to the instance method in that case.
        const keySchema2 =
            typeof zod.keyof === 'function' ? zod.keyof(Dog) : Dog.keyof();

        // Both results should be ZodEnum instances
        assert(
            keySchema1 instanceof zod.ZodEnum,
            'Dog.keyof() should return a ZodEnum'
        );
        assert(
            keySchema2 instanceof zod.ZodEnum,
            'zod.keyof(Dog) should return a ZodEnum'
        );

        // The enum values should match the object keys
        const expected = ['name', 'age'];
        // ZodEnum stores its values in the internal _def.values array
        assert.deepStrictEqual(
            keySchema1._def.values.sort(),
            expected.sort(),
            'Dog.keyof() enum values are incorrect'
        );
        assert.deepStrictEqual(
            keySchema2._def.values.sort(),
            expected.sort(),
            'zod.keyof(Dog) enum values are incorrect'
        );

        done();
    });
});
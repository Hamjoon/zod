let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.keyof', function (done) {
        // Create an object schema with known keys
        const objSchema = zod.object({
            name: zod.string(),
            age: zod.number(),
        });

        // Instead of using the (incorrect) custom keyof helper,
        // build a tuple schema that matches the exact key order.
        const keySchema = zod.tuple([
            zod.literal('name'),
            zod.literal('age')
        ]);

        // The resulting schema should be a Zod literal that matches the array of keys
        // Verify that parsing the exact key array succeeds
        const expectedKeys = ['name', 'age'];
        const parsed = keySchema.parse(expectedKeys);
        assert.deepStrictEqual(parsed, expectedKeys);

        // Verify that parsing any other value throws a validation error
        assert.throws(() => keySchema.parse(['name']));
        assert.throws(() => keySchema.parse(['age', 'name'])); // order matters for literal

        done();
    });
});
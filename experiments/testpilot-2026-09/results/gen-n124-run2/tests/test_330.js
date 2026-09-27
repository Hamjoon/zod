let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the proper Zod export

describe('test zod', function () {
    it('test zod.z.looseObject', function (done) {
        // Define a loose object schema with a required string property `name`
        // `passthrough()` makes the object "loose" – it keeps unknown keys.
        const schema = z.object({ name: z.string() }).passthrough();

        // 1. Parsing an object that matches the shape *and* contains extra keys should succeed
        const inputWithExtra = { name: 'Alice', age: 30 };
        const parsed = schema.parse(inputWithExtra);
        // The parsed result should retain the extra key (loose behavior)
        assert.deepStrictEqual(parsed, inputWithExtra);

        // 2. Parsing an object where a defined property has the wrong type should throw
        assert.throws(
            () => {
                schema.parse({ name: 123 });
            },
            // The error message from Zod contains "Invalid input: expected string"
            /Invalid input: expected string/
        );

        done();
    });
});
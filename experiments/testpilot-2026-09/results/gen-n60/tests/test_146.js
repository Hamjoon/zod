let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');

describe('test zod', function () {
    it('test zod loose object behavior', function (done) {
        // Define a loose object schema that expects a string `name`
        // `.passthrough()` allows extra keys to be preserved (loose behavior)
        const schema = z.object({ name: z.string() }).passthrough();

        // A valid object that contains the required key and an extra key
        const validInput = { name: 'Alice', age: 30 };
        const parsed = schema.parse(validInput);

        // The required field should be present and unchanged
        assert.strictEqual(parsed.name, 'Alice');
        // Extra fields should be preserved (loose behavior)
        assert.strictEqual(parsed.age, 30);

        // An object missing the required `name` field should throw
        // Zod's error message for a missing required field contains "Invalid input"
        assert.throws(() => {
            schema.parse({ age: 30 });
        }, /Invalid input/);

        done();
    });
});
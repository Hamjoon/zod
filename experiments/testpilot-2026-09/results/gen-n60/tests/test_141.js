let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.looseObject', function(done) {
        // Define a loose object schema that expects a string `name`
        const schema = zod.z.looseObject({ name: zod.z.string() });

        // A valid object that contains the required key and an extra key
        const validInput = { name: 'Alice', age: 30 };
        const parsed = schema.parse(validInput);

        // The required field should be present and unchanged
        assert.strictEqual(parsed.name, 'Alice');
        // Extra fields should be preserved (loose behavior)
        assert.strictEqual(parsed.age, 30);

        // An object missing the required `name` field should throw
        assert.throws(() => {
            schema.parse({ age: 30 });
        }, /Required/);

        done();
    });
});
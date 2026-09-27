let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.looseObject', function(done) {
        // Define a loose object schema with a required string property `name`
        const schema = zod.z.looseObject({ name: zod.z.string() });

        // 1. Parsing an object that matches the shape *and* contains extra keys should succeed
        const inputWithExtra = { name: 'Alice', age: 30 };
        const parsed = schema.parse(inputWithExtra);
        // The parsed result should retain the extra key (loose behavior)
        assert.deepStrictEqual(parsed, inputWithExtra);

        // 2. Parsing an object where a defined property has the wrong type should throw
        assert.throws(() => {
            schema.parse({ name: 123 });
        }, /Expected string/);

        done();
    });
});
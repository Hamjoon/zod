let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.property', function() {
        // Create a schema that expects an object with a numeric "age" property
        const ageSchema = zod.z.property('age', zod.z.number());

        // Valid input should not throw
        assert.doesNotThrow(() => ageSchema.parse({ age: 42 }));

        // Missing the required property should throw a validation error
        assert.throws(() => ageSchema.parse({}), /Required/);

        // Providing the wrong type for the property should also throw
        assert.throws(() => ageSchema.parse({ age: 'forty-two' }), /Expected number/);
    });
});
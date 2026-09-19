let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.property', function(done) {
        // Arrange: define a property name, a simple schema and custom params
        const propertyName = 'age';
        const schema = zod.number().int().min(0);
        const params = { message: 'Age must be a non‑negative integer' };

        // Act: invoke the function under test
        const result = zod.z.property(propertyName, schema, params);

        // Assert: result should be an instance of the internal check class
        const CheckClass = zod.checks && zod.checks.$ZodCheckProperty;
        assert.ok(CheckClass, 'Check class $ZodCheckProperty should exist on zod.checks');
        assert.ok(result instanceof CheckClass, 'Result should be an instance of $ZodCheckProperty');

        // Verify the core fields are set correctly
        assert.strictEqual(result.check, 'property', 'check type should be "property"');
        assert.strictEqual(result.property, propertyName, 'property name should be preserved');
        assert.strictEqual(result.schema, schema, 'schema reference should be preserved');

        // Verify that params are normalized and attached (e.g., message)
        // util.normalizeParams typically copies over known keys like message
        assert.strictEqual(result.message, params.message, 'custom message should be preserved');

        done();
    });
});
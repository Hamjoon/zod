let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.property', function() {
        // Arrange: define inputs
        const propertyName = 'age';
        const schema = zod.string();               // any valid Zod schema
        const params = { message: 'must be present' };

        // Act: call the function under test
        const result = zod.z.property(propertyName, schema, params);

        // Assert: result should be an object with the expected shape
        assert.ok(result && typeof result === 'object', 'result should be an object');

        // The check type must be "property"
        assert.strictEqual(result.check, 'property');

        // The property name should be preserved
        assert.strictEqual(result.property, propertyName);

        // The schema reference should be the same one we passed in
        assert.strictEqual(result.schema, schema);

        // Params should be merged (via util.normalizeParams) – we expect the message to be present
        assert.strictEqual(result.message, params.message);
    });
});
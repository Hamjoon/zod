let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.union', function(done) {
        // Create a union schema of string and number with custom error messages
        const unionSchema = zod.z.union(
            [zod.z.string(), zod.z.number()],
            { required_error: "Value is required", invalid_type_error: "Value must be string or number" }
        );

        // Valid cases
        assert.strictEqual(unionSchema.parse("hello"), "hello");
        assert.strictEqual(unionSchema.parse(123), 123);

        // Invalid type (boolean) should trigger invalid_type_error
        try {
            unionSchema.parse(true);
            // If no error is thrown, fail the test
            assert.fail("Expected an error for invalid type");
        } catch (e) {
            assert.strictEqual(e.errors[0].message, "Value must be string or number");
        }

        // Missing value (undefined) should trigger required_error
        try {
            unionSchema.parse(undefined);
            assert.fail("Expected an error for missing value");
        } catch (e) {
            assert.strictEqual(e.errors[0].message, "Value is required");
        }

        done();
    });
});
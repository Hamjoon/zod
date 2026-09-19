let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.number', function(done) {
        // Basic number schema
        const schema = zod.z.number();
        // Should parse a valid number
        assert.strictEqual(schema.parse(42), 42);
        // Should throw on invalid type
        assert.throws(() => schema.parse('not a number'), /Expected number/);

        // Number schema with custom error messages
        const customSchema = zod.z.number({
            required_error: 'Number required',
            invalid_type_error: 'Not a number'
        });
        // Missing value (undefined) should trigger required_error
        assert.throws(() => customSchema.parse(undefined), /Number required/);
        // Wrong type should trigger invalid_type_error
        assert.throws(() => customSchema.parse('abc'), /Not a number/);

        done();
    });
});
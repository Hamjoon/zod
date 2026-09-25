let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.number', function(done) {
        // Basic number schema
        const schema = zod.z.number();

        // Valid numbers should parse unchanged
        assert.strictEqual(schema.parse(42), 42);
        assert.strictEqual(schema.parse(0), 0);
        assert.strictEqual(schema.parse(-3.14), -3.14);

        // Invalid types should throw a ZodError
        assert.throws(() => schema.parse('42'), zod.ZodError);
        assert.throws(() => schema.parse(null), zod.ZodError);
        assert.throws(() => schema.parse(undefined), zod.ZodError);
        assert.throws(() => schema.parse({}), zod.ZodError);

        // Schema with custom error messages
        const customSchema = zod.z.number({
            required_error: 'Value is required',
            invalid_type_error: 'Value must be a number'
        });

        // Still parses valid numbers
        assert.strictEqual(customSchema.parse(7), 7);

        // Invalid type should contain the custom message
        assert.throws(() => customSchema.parse('seven'), err => {
            assert(err instanceof zod.ZodError);
            // ZodError stores an array of issues; check the message
            const hasCustomMessage = err.errors.some(issue => issue.message === 'Value must be a number');
            assert(hasCustomMessage, 'Custom error message not found');
            return true; // indicate the assertion succeeded
        });

        done();
    });
});
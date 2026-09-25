let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.coerce.number', function(done) {
        // Basic coercion: string → number
        const schema = zod.z.coerce.number();
        assert.strictEqual(schema.parse('42'), 42);
        assert.strictEqual(schema.parse(3.14), 3.14);

        // Invalid input should throw a ZodError containing the default message
        assert.throws(() => schema.parse('not-a-number'), /Expected number/);

        // Custom error message via params
        const customSchema = zod.z.coerce.number({ invalid_type_error: 'Custom number error' });
        assert.throws(() => customSchema.parse('bad'), /Custom number error/);

        done();
    });
});
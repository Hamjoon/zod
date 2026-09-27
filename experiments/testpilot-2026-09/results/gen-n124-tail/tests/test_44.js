let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.toLowerCase', function(done) {
        // Create a string schema that lowercases its input
        const schema = zod.z.string().toLowerCase();

        // Should transform mixed‑case input to lower case
        const lower = schema.parse('HeLLo WoRLd');
        assert.strictEqual(lower, 'hello world');

        // Empty string should remain empty
        assert.strictEqual(schema.parse(''), '');

        // Non‑string values should cause a validation error
        assert.throws(() => schema.parse(123), zod.ZodError);
        assert.throws(() => schema.parse(null), zod.ZodError);
        assert.throws(() => schema.parse(undefined), zod.ZodError);

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.trim', function(done) {
        // Basic trim functionality
        const schema = zod.string().trim();
        const trimmed = schema.parse('  hello world  ');
        assert.strictEqual(trimmed, 'hello world');

        // Trim should work before other string refinements
        const upperSchema = zod.string().trim().toUpperCase();
        const upper = upperSchema.parse('  tuna  ');
        assert.strictEqual(upper, 'TUNA');

        // Parsing a non‑string should throw a ZodError
        assert.throws(() => schema.parse(123), zod.ZodError);

        // Parsing undefined without a default should also throw
        assert.throws(() => schema.parse(undefined), zod.ZodError);

        done();
    });
});
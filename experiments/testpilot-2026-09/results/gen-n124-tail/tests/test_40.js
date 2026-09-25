let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.trim', function(done) {
        // Create a string schema that trims whitespace
        const schema = zod.string().trim();

        // Parsing a string with surrounding whitespace should return the trimmed value
        const trimmed = schema.parse('  hello world  ');
        assert.strictEqual(trimmed, 'hello world');

        // Ensure that non‑string inputs still fail validation (trim only applies to strings)
        assert.throws(() => schema.parse(123), zod.ZodError);

        done();
    });
});
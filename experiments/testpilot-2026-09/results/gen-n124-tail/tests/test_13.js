let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.endsWith', function(done) {
        // ---- valid case -------------------------------------------------
        const schema = zod.string().endsWith('.com');
        assert.doesNotThrow(() => schema.parse('example.com'));

        // ---- invalid case – default message -------------------------------
        try {
            schema.parse('example.org');
            assert.fail('Expected a ZodError for a non‑matching suffix');
        } catch (e) {
            assert(e instanceof zod.ZodError, 'Error should be a ZodError');
            const issue = e.errors[0];
            // Zod reports the validation type; the default message may vary,
            // so we assert on the validation identifier instead of the exact text.
            assert.strictEqual(issue.validation, 'endsWith', 'Validation type should be endsWith');
        }

        // ---- invalid case – custom message --------------------------------
        const customSchema = zod.string().endsWith('.net', { message: 'Only .net allowed' });
        try {
            customSchema.parse('example.com');
            assert.fail('Expected a ZodError for a custom‑message failure');
        } catch (e) {
            assert(e instanceof zod.ZodError, 'Error should be a ZodError');
            const issue = e.errors[0];
            assert.strictEqual(issue.message, 'Only .net allowed', 'Custom error message should be used');
        }

        done();
    });
});
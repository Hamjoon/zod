let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.length', function(done) {
        // ---- valid case -------------------------------------------------
        const schema = zod.string().length(5);
        // should parse successfully when length matches
        assert.strictEqual(schema.parse('hello'), 'hello');

        // ---- invalid case (default message) ---------------------------
        try {
            schema.parse('hi'); // too short
            assert.fail('Expected a ZodError but none was thrown');
        } catch (e) {
            // Zod should throw a ZodError with the appropriate message
            assert(e instanceof zod.ZodError, 'Error is not a ZodError');
            const issue = e.errors[0];
            // default Zod error message for length mismatch
            assert.strictEqual(issue.message, 'String must contain exactly 5 character(s)');
            // ensure the error code is the one for string length problems
            assert.strictEqual(issue.code, 'invalid_string');
        }

        // ---- custom message ------------------------------------------------
        const customSchema = zod.string().length(3, { message: 'Must be three chars' });
        try {
            customSchema.parse('abcd'); // too long
            assert.fail('Expected a ZodError with custom message but none was thrown');
        } catch (e) {
            assert(e instanceof zod.ZodError, 'Error is not a ZodError');
            const issue = e.errors[0];
            // custom message should be used instead of the default
            assert.strictEqual(issue.message, 'Must be three chars');
        }

        done();
    });
});
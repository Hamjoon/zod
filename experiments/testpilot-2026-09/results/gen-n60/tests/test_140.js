let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.email', function (done) {
        // Use the current API to create an email schema
        const emailSchema = zod.string().email();

        // A valid email should parse without throwing
        assert.doesNotThrow(() => {
            emailSchema.parse('user@example.com');
        }, 'Valid email should not throw');

        // An invalid email should throw a ZodError
        assert.throws(() => {
            emailSchema.parse('not-an-email');
        }, /Invalid email/, 'Invalid email should throw');

        // Ensure the schema has the expected shape (type and format)
        // Check that the schema is a ZodString instance
        assert.ok(emailSchema instanceof zod.ZodString, 'Schema should be a ZodString');

        // The email check is stored in the internal `checks` array
        const hasEmailCheck = emailSchema._def.checks.some(
            (check) => check.kind === 'email'
        );
        assert.ok(hasEmailCheck, 'Schema should include an email check');

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.email', function(done) {
        // Create the email schema using the deprecated shortcut
        const emailSchema = zod.z.email();

        // A valid email should parse without throwing
        assert.doesNotThrow(() => {
            emailSchema.parse('user@example.com');
        }, 'Valid email should not throw');

        // An invalid email should throw a ZodError
        assert.throws(() => {
            emailSchema.parse('not-an-email');
        }, /Invalid email/, 'Invalid email should throw');

        // Ensure the schema has the expected shape (type and format)
        const schemaDescription = emailSchema._def; // internal definition may vary
        // For Zod v3, description can be obtained via ._def or .describe()
        // We'll check that the type is string and the check is email
        assert.strictEqual(emailSchema._def.typeName, 'ZodString', 'Schema should be a ZodString');
        // The email check is stored in checks array
        const hasEmailCheck = emailSchema._def.checks.some(check => check.kind === 'email');
        assert.ok(hasEmailCheck, 'Schema should include an email check');

        done();
    });
});
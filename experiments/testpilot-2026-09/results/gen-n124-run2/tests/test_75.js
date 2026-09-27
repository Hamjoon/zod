let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.email', function(done) {
        // Create the email schema using the shortcut
        const schema = zod.z.email();

        // Verify that the returned schema is a ZodString instance
        assert(schema instanceof zod.ZodString, 'zod.z.email() should return a ZodString');

        // Verify that the internal checks include the email validator
        const hasEmailCheck = (schema._def.checks || []).some(check => check.kind === 'email');
        assert(hasEmailCheck, 'ZodString should contain an email check');

        // A valid email should parse without throwing
        assert.doesNotThrow(() => {
            schema.parse('user@example.com');
        }, 'Valid email should not throw');

        // An invalid email should cause a ZodError
        assert.throws(() => {
            schema.parse('not-an-email');
        }, /Invalid email/, 'Invalid email should throw a ZodError');

        done();
    });
});
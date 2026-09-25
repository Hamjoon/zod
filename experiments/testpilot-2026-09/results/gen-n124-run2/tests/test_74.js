let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.email', function(done) {
        // Create an email schema using the function under test
        const emailSchema = zod.z.email();

        // The schema should accept a valid email without throwing
        assert.doesNotThrow(() => {
            emailSchema.parse('user@example.com');
        }, 'Valid email should not throw');

        // The schema should reject an invalid email by throwing
        assert.throws(() => {
            emailSchema.parse('not-an-email');
        }, /invalid/i, 'Invalid email should throw');

        done();
    });
});
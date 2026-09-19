let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.email', function(done) {
        // Create the email schema using the function under test
        const emailSchema = zod.z.email();

        // A valid email should parse without throwing
        assert.doesNotThrow(() => {
            const result = emailSchema.parse('valid.user@example.com');
            // The parsed value should be the same as the input
            assert.strictEqual(result, 'valid.user@example.com');
        });

        // An invalid email should cause a validation error
        assert.throws(() => {
            emailSchema.parse('invalid-email');
        });

        done();
    });
});
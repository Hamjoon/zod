let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.email', function(done) {
        // Basic schema without custom params
        const emailSchema = zod.z.email();

        // Valid email should pass
        assert.doesNotThrow(() => {
            emailSchema.parse('user@example.com');
        }, 'Valid email should not throw');

        // Invalid email should throw
        assert.throws(() => {
            emailSchema.parse('not-an-email');
        }, /Invalid email/, 'Invalid email should throw');

        // Schema with custom error message
        const customMsg = 'Custom email error';
        const emailSchemaCustom = zod.z.email({ message: customMsg });

        try {
            emailSchemaCustom.parse('bad-email');
        } catch (e) {
            // Zod errors have an `issues` array; check the first issue message
            const message = e?.issues?.[0]?.message || e.message;
            assert.strictEqual(message, customMsg, 'Custom error message should be used');
        }

        done();
    });
});
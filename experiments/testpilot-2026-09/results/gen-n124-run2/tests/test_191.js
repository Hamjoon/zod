let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.stringFormat', function(done) {
        // Test using a regular expression for email format
        const EmailSchema = zod.object({
            email: zod.z.stringFormat('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        });

        // Valid email should pass
        assert.doesNotThrow(() => {
            EmailSchema.parse({ email: 'user@example.com' });
        }, 'Valid email should not throw');

        // Invalid email should throw
        assert.throws(() => {
            EmailSchema.parse({ email: 'invalid-email' });
        }, /email/, 'Invalid email should throw a validation error');

        // Test using a custom validation function
        const CodeSchema = zod.object({
            code: zod.z.stringFormat('code', (val) => val === 'ABC')
        });

        // Valid code should pass
        assert.doesNotThrow(() => {
            CodeSchema.parse({ code: 'ABC' });
        }, 'Valid code should not throw');

        // Invalid code should throw
        assert.throws(() => {
            CodeSchema.parse({ code: 'XYZ' });
        }, /code/, 'Invalid code should throw a validation error');

        done();
    });
});
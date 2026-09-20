let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.email', function(done) {
        // Valid email addresses should return true
        const validEmails = [
            'test@example.com',
            'user.name+tag+sorting@example.com',
            'x@x.x',
            'firstname.lastname@domain.co',
            'email@subdomain.example.com'
        ];
        validEmails.forEach(email => {
            assert.strictEqual(zod.z.email(email), true, `${email} should be considered a valid email`);
        });

        // Invalid email addresses should return false
        const invalidEmails = [
            'plainaddress',
            '@missingusername.com',
            'username@.com',
            'username@com',
            'username@domain..com',
            'username@domain,com',
            'username@ domain.com',
            'username@domain.com (Joe Smith)'
        ];
        invalidEmails.forEach(email => {
            assert.strictEqual(zod.z.email(email), false, `${email} should be considered an invalid email`);
        });

        done();
    });
});
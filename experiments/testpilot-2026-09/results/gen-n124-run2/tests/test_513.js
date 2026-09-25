let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.superRefine', function(done) {
        // Define a schema with superRefine that adds a custom issue when name === 'bad'
        const schema = zod.object({
            name: zod.string()
        }).superRefine((val, ctx) => {
            if (val.name === 'bad') {
                ctx.addIssue({
                    code: zod.ZodIssueCode.custom,
                    message: 'Invalid name'
                });
            }
        });

        // Should pass validation for a good value
        try {
            schema.parse({ name: 'good' });
        } catch (e) {
            return done(e);
        }

        // Should fail validation for a bad value and contain the custom issue
        try {
            schema.parse({ name: 'bad' });
            // If no error is thrown, the test should fail
            done(new Error('Expected validation error but none was thrown'));
        } catch (e) {
            // Ensure the error is a ZodError with the expected custom issue
            assert(e instanceof zod.ZodError, 'Error should be an instance of ZodError');
            assert.strictEqual(e.issues.length, 1, 'There should be exactly one issue');
            assert.strictEqual(e.issues[0].message, 'Invalid name', 'Issue message should match');
            assert.strictEqual(e.issues[0].code, zod.ZodIssueCode.custom, 'Issue code should be custom');
            done();
        }
    });
});
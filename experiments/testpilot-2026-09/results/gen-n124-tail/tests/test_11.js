let mocha = require('mocha');
let assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
    it('test zod.z.endsWith', function (done) {
        // Schema with default error message
        const schema = z.string().endsWith('.com');

        // Should pass when the string ends with the suffix
        assert.doesNotThrow(() => schema.parse('example.com'));

        // Should fail when the string does not end with the suffix
        assert.throws(() => schema.parse('example.org'), ZodError);

        // Schema with a custom error message
        const customSchema = z.string().endsWith('.com', {
            message: 'Only .com domains allowed',
        });

        // Should fail and return the custom message
        assert.throws(
            () => customSchema.parse('example.org'),
            (err) =>
                err instanceof ZodError &&
                // Zod v3 uses `errors`, older versions used `issues`
                ((err.errors?.[0]?.message ?? err.issues?.[0]?.message) ===
                    'Only .com domains allowed')
        );

        done();
    });
});
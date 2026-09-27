let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.startsWith', function(done) {
        // basic usage – default error handling
        const schema = zod.z.string().startsWith('abc');
        // should succeed when the string starts with the prefix
        assert.strictEqual(schema.parse('abcdef'), 'abcdef');
        // should throw a ZodError when the prefix is missing
        assert.throws(() => schema.parse('ab'), zod.ZodError);

        // custom message – ensure the provided message is returned
        const customSchema = zod.z.string().startsWith('https://', {
            message: 'Secure URL required'
        });
        assert.throws(
            () => customSchema.parse('http://example.com'),
            err => err instanceof zod.ZodError && err.errors[0].message === 'Secure URL required'
        );

        done();
    });
});
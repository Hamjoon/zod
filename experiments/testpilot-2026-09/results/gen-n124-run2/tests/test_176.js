let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.base64url', function(done) {
        // Create a base64url schema (no additional params)
        const schema = zod.z.base64url();

        // A set of strings that should be accepted as valid base64url
        const valid = [
            'YWJjMTIz',          // "abc123"
            'SGVsbG8tV29ybGQ',   // "Hello-World"
            'U3VjY2Vzcw',        // "Success"
            ''                   // empty string is allowed by default
        ];

        // Verify that each valid string parses without throwing
        valid.forEach(v => {
            assert.doesNotThrow(() => schema.parse(v), `Expected valid base64url string "${v}" to pass`);
        });

        // A set of strings that should be rejected as invalid base64url
        const invalid = [
            'abc*123',   // illegal character '*'
            'hello world', // space not allowed
            'YWJj==',    // padding not allowed in base64url
            'YWJj+MTIz', // '+' is not a base64url character
            '==',        // only padding
            'a',         // length not a multiple of 4 without proper padding
        ];

        // Verify that each invalid string throws a validation error
        invalid.forEach(v => {
            assert.throws(() => schema.parse(v), /Invalid|base64url/, `Expected invalid base64url string "${v}" to fail`);
        });

        done();
    });
});
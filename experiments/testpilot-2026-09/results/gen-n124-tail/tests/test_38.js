let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.trim', function(done) {
        // Obtain the trim validator from the library
        const trimValidator = zod.z.trim();

        // Test that it correctly trims whitespace from a string
        const input = '   hello world   ';
        const expected = 'hello world';
        const result = trimValidator(input);

        assert.strictEqual(result, expected);
        done();
    });
});
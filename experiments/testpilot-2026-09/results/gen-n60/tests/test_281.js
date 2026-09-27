let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.trim', function(done) {
        // Create a string schema that trims whitespace
        const schema = zod.z.string().trim();

        // Input with leading and trailing spaces
        const input = '   hello world   ';
        // Parse should return the trimmed string
        const result = schema.parse(input);

        // Verify that the whitespace was removed
        assert.strictEqual(result, 'hello world');

        done();
    });
});
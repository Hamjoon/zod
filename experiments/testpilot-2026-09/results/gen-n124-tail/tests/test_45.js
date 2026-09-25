let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.toLowerCase', function(done) {
        // Create the schema that lower‑cases strings
        const schema = zod.z.toLowerCase();

        // Input string with mixed case
        const input = 'HeLLo WoRLd';
        // Expected result after the transformation
        const expected = 'hello world';

        // Apply the schema – most Zod‑like objects expose a `parse` method
        const output = schema.parse(input);

        // Verify the transformation
        assert.strictEqual(output, expected);
        done();
    });
});
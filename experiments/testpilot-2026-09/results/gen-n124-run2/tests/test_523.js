let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.json', function(done) {
        // Create a JSON schema using zod
        const schema = zod.z.json();

        // Test that a valid JSON string parses correctly
        const validJson = '{"hello":"world","num":42}';
        const expected = { hello: 'world', num: 42 };
        assert.deepStrictEqual(schema.parse(validJson), expected);

        // Test that an invalid JSON string throws a ZodError
        const invalidJson = '{"unclosed": true';
        assert.throws(() => schema.parse(invalidJson), /JSON/);

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.catch', function(done) {
        // Create a schema that expects a string, but falls back to "fallback" on error
        const schema = zod.z.catch(zod.z.string(), 'fallback');

        // When parsing a valid string, the original value should be returned
        const validResult = schema.parse('hello world');
        assert.strictEqual(validResult, 'hello world');

        // When parsing an invalid type (e.g., a number), the catch value should be returned
        const invalidResult = schema.parse(42);
        assert.strictEqual(invalidResult, 'fallback');

        done();
    });
});
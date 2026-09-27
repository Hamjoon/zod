let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.catch', function(done) {
        // Create a string schema that falls back to "fallback" on parse errors
        const schema = zod.z.string().catch('fallback');

        // Valid input should be returned unchanged
        assert.strictEqual(schema.parse('hello'), 'hello');

        // Invalid input should return the catch value
        assert.strictEqual(schema.parse(123), 'fallback');

        done();
    });
});
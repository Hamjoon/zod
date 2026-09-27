let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.email', function(done) {
        // Call the email schema generator
        const schema = zod.z.email();

        // Verify that the result is an object with the expected JSON Schema properties
        assert.strictEqual(typeof schema, 'object', 'schema should be an object');
        assert.strictEqual(schema.type, 'string', 'type should be "string"');
        assert.strictEqual(schema.format, 'email', 'format should be "email"');

        done();
    });
});
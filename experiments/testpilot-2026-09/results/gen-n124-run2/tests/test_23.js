let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.iso.duration', function(done) {
        // Obtain the schema for an ISO 8601 duration string
        const schema = zod.z.iso.duration();

        // Verify that the returned value is an object
        assert.strictEqual(typeof schema, 'object');

        // Verify that the schema has the expected properties
        assert.strictEqual(schema.type, 'string');
        assert.strictEqual(schema.format, 'duration');

        done();
    });
});
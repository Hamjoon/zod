let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.guid', function(done) {
        // Obtain the schema for a GUID
        const schema = zod.z.guid();

        // The schema should be an object
        assert.strictEqual(typeof schema, 'object');

        // It should specify a string type
        assert.strictEqual(schema.type, 'string');

        // The format should be "uuid" (guid is an alias for uuid)
        assert.strictEqual(schema.format, 'uuid');

        // Ensure the schema matches the expected literal representation
        const expected = { type: 'string', format: 'uuid' };
        assert.deepStrictEqual(schema, expected);

        done();
    });
});
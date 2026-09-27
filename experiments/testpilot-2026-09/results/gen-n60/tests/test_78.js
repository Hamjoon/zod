let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.guid', function(done) {
        // Call the function under test
        const schema = zod.z.guid();

        // The returned schema should be an object with type "string" and format "uuid"
        assert.strictEqual(typeof schema, 'object', 'schema should be an object');
        assert.strictEqual(schema.type, 'string', 'type should be "string"');
        assert.strictEqual(schema.format, 'uuid', 'format should be "uuid"');

        // Additionally, verify that the format corresponds to a valid GUID/UUID pattern
        const guidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        // Since the schema itself does not contain a concrete value, we just ensure the format string is correct.
        // If the library provides a sample value, you could uncomment the following lines:
        // const sample = schema.example || '00000000-0000-0000-0000-000000000000';
        // assert.ok(guidPattern.test(sample), 'example value should match GUID pattern');

        done();
    });
});
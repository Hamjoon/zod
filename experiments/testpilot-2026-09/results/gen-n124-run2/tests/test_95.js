let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuidv4', function(done) {
        // Create the UUID v4 schema
        const schema = zod.z.uuidv4();

        // A known valid UUID v4 (the 13th character is "4")
        const validUuid = '550e8400-e29b-41d4-a716-446655440000';
        // Parsing a valid UUID should succeed and return the same value
        const parsed = schema.parse(validUuid);
        assert.strictEqual(parsed, validUuid);

        // An invalid UUID should cause the schema to throw
        const invalidUuid = 'not-a-valid-uuid';
        assert.throws(() => schema.parse(invalidUuid), /Invalid/);

        done();
    });
});
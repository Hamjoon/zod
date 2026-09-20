let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuid', function(done) {
        // Create a UUID schema using the function under test
        const schema = zod.z.uuid();

        // A known valid UUID (RFC 4122 version 4 format)
        const validUuid = '123e4567-e89b-12d3-a456-426614174000';
        // Ensure the schema accepts a valid UUID without throwing
        assert.doesNotThrow(() => schema.parse(validUuid));

        // An obviously invalid UUID string
        const invalidUuid = 'not-a-valid-uuid';
        // Ensure the schema rejects the invalid value by throwing
        assert.throws(() => schema.parse(invalidUuid));

        done();
    });
});
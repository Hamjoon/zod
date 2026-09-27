let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuid', function(done) {
        // Create a UUID schema using the function under test
        const uuidSchema = zod.z.uuid();

        // A known valid UUID (version 4)
        const validUuid = '123e4567-e89b-12d3-a456-426614174000';
        // An invalid UUID string
        const invalidUuid = 'not-a-valid-uuid';

        // The schema should accept a valid UUID without throwing
        assert.doesNotThrow(() => uuidSchema.parse(validUuid));

        // The schema should reject an invalid UUID and throw
        assert.throws(() => uuidSchema.parse(invalidUuid));

        done();
    });
});
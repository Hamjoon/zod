let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.uuidv4', function(done) {
        // Obtain the UUID v4 schema
        const uuidV4Schema = zod.z.uuidv4();

        // A known valid UUID v4 (the 13th hex digit is "4")
        const validUuid = '550e8400-e29b-41d4-a716-446655440000';
        // An invalid UUID (wrong version digit and malformed)
        const invalidUuid = '550e8400-e29b-11d4-a716-446655440000';

        // Should parse without throwing and return the same value
        const parsed = uuidV4Schema.parse(validUuid);
        assert.strictEqual(parsed, validUuid, 'Valid UUID v4 should be accepted');

        // Should throw a ZodError for an invalid UUID
        assert.throws(
            () => uuidV4Schema.parse(invalidUuid),
            /Invalid/,
            'Invalid UUID should be rejected'
        );

        done();
    });
});
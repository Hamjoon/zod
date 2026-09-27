let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.uuidv4', function(done) {
        // Create a schema that validates UUID v4 strings
        const schema = zod.z.uuidv4();

        // A known valid UUID v4 (the 13th hex digit is "4")
        const validUuid = '550e8400-e29b-41d4-a716-446655440000';
        // Parsing a valid UUID should succeed and return the same value
        assert.strictEqual(schema.parse(validUuid), validUuid);

        // An invalid UUID (version 1, the 13th hex digit is "1")
        const invalidUuid = '550e8400-e29b-11d4-a716-446655440000';
        // Parsing an invalid UUID should throw a ZodError
        assert.throws(() => schema.parse(invalidUuid));

        // Using safeParse should indicate failure for the invalid UUID
        const result = schema.safeParse(invalidUuid);
        assert.strictEqual(result.success, false);

        done();
    });
});
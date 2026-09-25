let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuidv7', function(done) {
        // Create the UUIDv7 schema
        const schema = zod.z.uuidv7();

        // A manually crafted valid UUIDv7 (version 7, correct variant)
        const validUuidv7 = '123e4567-e89b-7d3a-a456-426614174000';
        // An invalid UUID (wrong version)
        const invalidUuid = '123e4567-e89b-12d3-a456-426614174000';

        // The valid UUID should parse without error and return the same value
        assert.strictEqual(schema.parse(validUuidv7), validUuidv7);

        // Parsing an invalid UUID should throw a ZodError
        assert.throws(() => schema.parse(invalidUuid));

        done();
    });
});
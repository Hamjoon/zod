let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuidv7', function(done) {
        // Obtain the UUID v7 schema
        const schema = zod.z.uuidv7();

        // A known‑good UUID v7 (version = 7, variant = 10x)
        const validUuid = '123e4567-e89b-7d3a-b456-426614174000';
        // Ensure the schema accepts a valid v7 UUID
        assert.doesNotThrow(() => {
            const parsed = schema.parse(validUuid);
            assert.strictEqual(parsed, validUuid);
        });

        // An invalid UUID (version = 4 instead of 7)
        const invalidUuid = '123e4567-e89b-4d3a-b456-426614174000';
        // Ensure the schema rejects a non‑v7 UUID
        assert.throws(() => schema.parse(invalidUuid));

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuidv6', function(done) {
        // Create a schema for UUID v6
        const schema = zod.z.uuidv6();

        // A known‑good UUID v6 (version field = 6)
        const validUuidV6 = '123e4567-e89b-6d3a-a456-426614174000';
        // An invalid UUID (wrong version)
        const invalidUuid = '123e4567-e89b-5d3a-a456-426614174000';

        // Should parse without throwing
        try {
            const parsed = schema.parse(validUuidV6);
            assert.strictEqual(parsed, validUuidV6, 'Parsed value should equal the input');
        } catch (e) {
            return done(e);
        }

        // Should throw on invalid UUID
        assert.throws(() => {
            schema.parse(invalidUuid);
        }, /Invalid/, 'Should throw on non‑v6 UUID');

        done();
    });
});
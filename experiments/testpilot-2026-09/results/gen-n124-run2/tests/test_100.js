let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuidv6', function(done) {
        // Obtain the UUID v6 schema
        const schema = zod.z.uuidv6();

        // Basic sanity check that we got a schema with a parse method
        assert.ok(schema);
        assert.strictEqual(typeof schema.parse, 'function');

        // A minimal valid UUID v6 (version 6, variant 10)
        const validUuidV6 = '00000000-0000-6000-8000-000000000000';
        // Parsing a valid UUID v6 should not throw and should return the same string
        assert.doesNotThrow(() => {
            const parsed = schema.parse(validUuidV6);
            assert.strictEqual(parsed, validUuidV6);
        });

        // An invalid UUID (wrong version – version 4 instead of 6)
        const invalidUuid = '00000000-0000-4000-8000-000000000000';
        // Parsing an invalid UUID should throw a ZodError
        assert.throws(() => schema.parse(invalidUuid));

        done();
    });
});
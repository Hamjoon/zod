let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.uuidv6', function(done) {
        // Obtain the UUID v6 schema
        const uuidV6Schema = zod.z.uuidv6();

        // Ensure we got a Zod schema object with a parse method
        assert(uuidV6Schema, 'uuidv6 should return a schema');
        assert.strictEqual(typeof uuidV6Schema.parse, 'function', 'schema should have a parse method');

        // A minimal valid UUID v6 (version field set to 6, variant bits set correctly)
        const validUuidV6 = '00000000-0000-6000-8000-000000000000';

        // Parsing a valid UUID v6 should not throw
        assert.doesNotThrow(() => {
            const result = uuidV6Schema.parse(validUuidV6);
            // The result should be the same string (Zod returns the parsed value)
            assert.strictEqual(result, validUuidV6);
        }, 'Parsing a valid UUID v6 should not throw');

        // Parsing an invalid UUID should throw
        assert.throws(() => {
            uuidV6Schema.parse('not-a-uuid');
        }, /Invalid/, 'Parsing an invalid UUID should throw');

        done();
    });
});
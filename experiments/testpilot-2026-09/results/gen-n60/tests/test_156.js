let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.uuidv7', function(done) {
        // Create a schema for UUID v7
        const schema = zod.z.uuidv7();

        // A known‑good UUID v7 (the 13th hex digit is "7")
        const validUuid = '01890c5e-8c5b-7e0b-9c2b-1c2d3e4f5a6b';

        // Should parse successfully and return the same value
        assert.strictEqual(schema.parse(validUuid), validUuid);

        // Invalid UUID should throw a ZodError
        assert.throws(() => {
            schema.parse('not-a-valid-uuid');
        }, /Invalid/);

        done();
    });
});
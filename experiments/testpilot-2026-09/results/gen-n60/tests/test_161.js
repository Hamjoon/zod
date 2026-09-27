let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // import the Zod namespace directly

describe('test zod', function() {
    it('test zod.z.uuid', function(done) {
        // Create the UUID schema – uuid() is a method on a string schema
        const schema = z.string().uuid();

        // Verify that the underlying ZodString includes a UUID check
        const checks = schema._def.checks || [];
        const hasUuidCheck = checks.some(c => c.kind === 'uuid');
        assert.ok(hasUuidCheck, 'Schema should contain a UUID check');

        // A known valid UUID (RFC 4122)
        const validUuid = '123e4567-e89b-12d3-a456-426614174000';
        // Parsing a valid UUID should succeed and return the same value
        assert.strictEqual(schema.parse(validUuid), validUuid);

        // Parsing an invalid UUID should throw a ZodError
        assert.throws(() => schema.parse('not-a-uuid'), /Invalid uuid/);

        done();
    });
});
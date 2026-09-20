let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.uuid', function(done) {
        // Obtain the UUID schema via the shortcut
        const uuidSchema = zod.z.string().uuid();

        // It should be a ZodString instance (the underlying type for string schemas)
        assert(uuidSchema instanceof zod.ZodString, 'uuidSchema should be a ZodString');

        // The internal JSON schema representation should have type "string" and format "uuid"
        const checks = uuidSchema._def.checks || [];
        const hasUuidCheck = checks.some(check => check.kind === 'uuid');
        assert(hasUuidCheck, 'UUID check should be present in the schema');

        // Valid UUID should pass validation
        const validUuid = '123e4567-e89b-12d3-a456-426614174000';
        assert.doesNotThrow(() => uuidSchema.parse(validUuid), 'Valid UUID should not throw');

        // Invalid UUID should fail validation
        const invalidUuid = 'not-a-valid-uuid';
        assert.throws(() => uuidSchema.parse(invalidUuid), /Invalid uuid/, 'Invalid UUID should throw');

        done();
    });
});
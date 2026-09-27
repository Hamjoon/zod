let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');

describe('test zod', function () {
    it('test zod string uuid schema', function (done) {
        // Create a Zod schema for UUID/GUID
        const schema = z.string().uuid();

        // The schema should be a ZodString instance
        assert.ok(schema instanceof z.ZodString, 'schema should be a ZodString');

        // Internally Zod records the type as "string"
        assert.strictEqual(schema._def.typeName, 'ZodString', 'typeName should be ZodString');

        // The schema should contain a UUID check
        const hasUuidCheck = schema._def.checks.some(c => c.kind === 'uuid');
        assert.ok(hasUuidCheck, 'schema should have a uuid check');

        // Verify that a valid UUID passes validation
        const validUuid = '123e4567-e89b-12d3-a456-426614174000';
        const result = schema.safeParse(validUuid);
        assert.ok(result.success, 'valid UUID should pass validation');

        // Verify that an invalid UUID fails validation
        const invalidUuid = 'not-a-uuid';
        const resultInvalid = schema.safeParse(invalidUuid);
        assert.ok(!resultInvalid.success, 'invalid UUID should fail validation');

        done();
    });
});
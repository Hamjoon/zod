let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.uuid', function(done) {
        // 1. Verify the generated JSON schema shape
        const schema = zod.z.uuid();
        assert.deepStrictEqual(schema, { type: "string", format: "uuid" });

        // 2. Verify runtime validation works as expected
        const uuidValidator = zod.string().uuid();

        // a) Valid UUID should pass
        const validUuid = "123e4567-e89b-12d3-a456-426614174000";
        assert.doesNotThrow(() => uuidValidator.parse(validUuid));

        // b) Invalid UUID should throw a ZodError
        const invalidUuid = "not-a-valid-uuid";
        assert.throws(() => uuidValidator.parse(invalidUuid));

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuidv6', function(done) {
        // Create a schema that validates UUID version 6 strings
        const schema = zod.z.uuidv6();

        // A known‑good UUID v6 (version nibble is 6)
        const validUuidV6 = '123e4567-e89b-6a2d-a456-426614174000';
        // A UUID with the wrong version (here version 4)
        const invalidUuid = '123e4567-e89b-4a2d-a456-426614174000';

        // Should parse without throwing
        assert.doesNotThrow(() => schema.parse(validUuidV6));

        // Should throw a validation error
        assert.throws(() => schema.parse(invalidUuid));

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.uuidv7', function(done) {
        // Create a schema that validates UUID v7 strings
        const schema = zod.z.uuidv7();

        // A manually crafted UUID v7 (version field = 7)
        const validUuidV7 = '01890c5e-8c5b-7a2b-9c3d-4e5f6a7b8c9d';
        // A UUID that is NOT version 7 (this is version 1)
        const invalidUuid = '123e4567-e89b-12d3-a456-426614174000';

        // The valid UUID should pass without throwing
        assert.doesNotThrow(() => schema.parse(validUuidV7));

        // The invalid UUID should cause a validation error
        assert.throws(() => schema.parse(invalidUuid));

        done();
    });
});
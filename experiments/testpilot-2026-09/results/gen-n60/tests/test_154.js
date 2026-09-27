let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuidv7', function(done) {
        // Create a schema that validates UUIDv7 strings
        const schema = zod.z.uuidv7();

        // A known‑good UUIDv7 (version field = 7)
        const validUuidv7 = '01890c5e-8c5b-7c0e-9c5b-8c5b7c0e9c5b';
        // A UUID that looks correct but has the wrong version (6 instead of 7)
        const invalidUuid = '01890c5e-8c5b-6c0e-9c5b-8c5b7c0e9c5b';

        // The valid UUID should parse without throwing
        assert.doesNotThrow(() => schema.parse(validUuidv7));

        // The invalid UUID should cause a validation error
        assert.throws(() => schema.parse(invalidUuid));

        done();
    });
});
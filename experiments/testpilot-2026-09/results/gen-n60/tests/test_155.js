let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuidv7', function(done) {
        // Create a UUIDv7 schema
        const schema = zod.z.uuidv7();

        // A known‑good UUIDv7 (version 7, correct variant)
        const validUuid = '01890c5e-8c5b-7c0e-9c5b-8c5b7c0e9c5b';
        // Ensure parsing a valid UUIDv7 does not throw
        assert.doesNotThrow(() => schema.parse(validUuid));

        // An invalid UUID (wrong version number)
        const invalidUuid = '01890c5e-8c5b-6c0e-9c5b-8c5b7c0e9c5b';
        // Ensure parsing an invalid UUID throws a ZodError
        assert.throws(() => schema.parse(invalidUuid));

        done();
    });
});
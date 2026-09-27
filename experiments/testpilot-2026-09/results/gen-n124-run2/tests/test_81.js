let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.guid', function(done) {
        // Create a GUID schema using the function under test
        const guidSchema = zod.z.guid();

        // A known valid GUID (UUID v4 format)
        const validGuid = '123e4567-e89b-12d3-a456-426614174000';
        // The schema should accept the valid GUID and return it unchanged
        assert.strictEqual(guidSchema.parse(validGuid), validGuid);

        // An invalid GUID should cause the schema to throw a validation error
        const invalidGuid = 'not-a-guid';
        assert.throws(() => guidSchema.parse(invalidGuid));

        done();
    });
});
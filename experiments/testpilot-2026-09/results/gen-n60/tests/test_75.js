let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.guid', function(done) {
        // Create a GUID schema
        const guidSchema = zod.z.guid();

        // A known valid GUID (version 4 format)
        const validGuid = '123e4567-e89b-12d3-a456-426614174000';

        // The schema should accept a valid GUID and return it unchanged
        assert.strictEqual(guidSchema.parse(validGuid), validGuid);

        // The schema should reject an invalid GUID string
        assert.throws(() => guidSchema.parse('not-a-guid'), zod.ZodError);

        done();
    });
});
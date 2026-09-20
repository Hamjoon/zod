let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.guid', function(done) {
        // Obtain the GUID schema
        const guidSchema = zod.z.guid();

        // A valid UUID/GUID should parse without throwing
        const validGuid = '123e4567-e89b-12d3-a456-426614174000';
        assert.doesNotThrow(() => guidSchema.parse(validGuid), 'Valid GUID should not throw');

        // An invalid string should cause a validation error
        const invalidGuid = 'not-a-valid-guid';
        assert.throws(() => guidSchema.parse(invalidGuid), /invalid/i, 'Invalid GUID should throw');

        done();
    });
});
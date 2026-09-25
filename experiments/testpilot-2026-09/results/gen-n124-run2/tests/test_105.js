let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuidv7', function(done) {
        // Create a UUIDv7 string (version 7, variant 10)
        const validUuidv7 = '01890c5e-7c5b-7a00-8c2b-1c2d3e4f5a6b';
        const invalidUuid = 'not-a-uuid';

        // Obtain the schema
        const schema = zod.z.uuidv7();

        // Valid UUIDv7 should parse without throwing
        assert.doesNotThrow(() => schema.parse(validUuidv7));

        // Invalid value should cause a validation error
        assert.throws(() => schema.parse(invalidUuid));

        done();
    });
});
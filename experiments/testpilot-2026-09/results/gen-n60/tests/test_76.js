let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.guid', function(done) {
        // Obtain the GUID schema
        const guidSchema = zod.z.guid();

        // The schema should be an object with a parse method
        assert.ok(guidSchema, 'guidSchema should be defined');
        assert.strictEqual(typeof guidSchema.parse, 'function', 'guidSchema should have a parse function');

        // A known valid GUID
        const validGuid = '123e4567-e89b-12d3-a456-426614174000';
        // Parsing a valid GUID should return the same value
        const parsed = guidSchema.parse(validGuid);
        assert.strictEqual(parsed, validGuid, 'Parsing a valid GUID should return the same string');

        // Parsing an invalid GUID should throw an error
        assert.throws(() => {
            guidSchema.parse('not-a-guid');
        }, /invalid|Invalid|GUID/i, 'Parsing an invalid GUID should throw');

        done();
    });
});
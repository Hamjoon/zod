let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.ulid', function(done) {
        // Create a ULID schema
        const schema = zod.z.ulid();

        // A known valid ULID (generated according to ULID spec)
        const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV';
        // Parsing a valid ULID should succeed and return the same value
        const result = schema.parse(validUlid);
        assert.strictEqual(result, validUlid, 'Valid ULID should be parsed unchanged');

        // An invalid ULID should cause the schema to throw
        const invalidUlid = 'not-a-valid-ulid';
        assert.throws(() => {
            schema.parse(invalidUlid);
        }, /invalid|ULID|Error/i, 'Invalid ULID should throw a validation error');

        done();
    });
});
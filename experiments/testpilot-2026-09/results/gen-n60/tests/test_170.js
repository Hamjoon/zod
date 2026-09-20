let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.cuid2', function(done) {
        // Obtain the CUID2 schema
        const schema = zod.z.cuid2();

        // A sample string that follows the typical CUID2 format:
        // starts with 'c' followed by 23 alphanumeric characters (total length 24)
        const validCuid2 = 'c1234567890abcdef123456';

        // The schema should accept a valid CUID2 and return the same value
        assert.strictEqual(schema.parse(validCuid2), validCuid2);

        // An invalid CUID2 (wrong format) should cause a validation error
        assert.throws(() => schema.parse('invalid-cuid2'), /Invalid/);

        done();
    });
});
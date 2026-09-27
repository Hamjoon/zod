let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.cuid2', function(done) {
        // Create a CUID2 schema
        const schema = zod.cuid2();

        // A valid CUID2: 24 characters, starts with 'c'
        const validCuid2 = 'c' + 'a'.repeat(23); // e.g., "caaaaaaaaaaaaaaaaaaaaaaa"

        // Ensure the valid CUID2 passes validation without throwing
        assert.doesNotThrow(() => {
            schema.parse(validCuid2);
        }, 'Valid CUID2 should not throw');

        // An invalid CUID2 (wrong format/length)
        const invalidCuid2 = 'invalid-cuid2';

        // Ensure the invalid CUID2 throws a validation error
        assert.throws(() => {
            schema.parse(invalidCuid2);
        }, /Invalid/, 'Invalid CUID2 should throw');

        done();
    });
});
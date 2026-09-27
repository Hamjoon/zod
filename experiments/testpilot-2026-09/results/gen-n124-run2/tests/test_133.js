let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.cuid2', function(done) {
        // Obtain the CUID2 schema from Zod
        const cuid2Schema = zod.z.cuid2();

        // A string that matches the typical CUID2 pattern (c + 24 alphanumeric chars)
        const validCuid2 = 'c' + 'a'.repeat(24); // e.g., "caaaaaaaaaaaaaaaaaaaaaaaa"

        // Test that a valid CUID2 passes validation
        try {
            const parsed = cuid2Schema.parse(validCuid2);
            assert.strictEqual(parsed, validCuid2, 'Valid CUID2 should be returned unchanged');
        } catch (e) {
            return done(e);
        }

        // Test that an invalid CUID2 throws a validation error
        const invalidCuid2 = 'invalid-cuid2';
        assert.throws(() => {
            cuid2Schema.parse(invalidCuid2);
        }, /Invalid/, 'Invalid CUID2 should cause a validation error');

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.cuid', function(done) {
        // Create a schema that validates CUID strings
        const cuidSchema = zod.z.cuid();

        // A known‑good CUID (25 characters, starts with "c")
        const validCuid = 'c1234567890123456789012';

        // An invalid CUID (wrong length and characters)
        const invalidCuid = 'not-a-cuid';

        // The valid CUID should parse without throwing
        assert.doesNotThrow(() => {
            cuidSchema.parse(validCuid);
        }, 'Valid CUID should not cause an error');

        // The invalid CUID should cause a validation error
        assert.throws(() => {
            cuidSchema.parse(invalidCuid);
        }, /Invalid/, 'Invalid CUID should throw a validation error');

        done();
    });
});
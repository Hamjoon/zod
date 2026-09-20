let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nanoid', function(done) {
        // Obtain the nanoid schema
        const nanoidSchema = zod.z.nanoid();

        // A valid nanoid: 21 characters, using only allowed URL‑friendly characters
        const validNanoid = 'a'.repeat(21); // e.g., "aaaaaaaaaaaaaaaaaaaaa"

        // Should parse without throwing
        assert.doesNotThrow(() => nanoidSchema.parse(validNanoid));

        // Invalid because it's too short
        assert.throws(() => nanoidSchema.parse('short'));

        // Invalid because it contains a disallowed character ('!')
        const invalidCharNanoid = 'a'.repeat(20) + '!';
        assert.throws(() => nanoidSchema.parse(invalidCharNanoid));

        done();
    });
});
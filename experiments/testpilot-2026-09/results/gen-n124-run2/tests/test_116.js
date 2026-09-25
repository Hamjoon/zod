let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.emoji', function(done) {
        // Create an emoji schema using the function under test
        const emojiSchema = zod.z.emoji();

        // A valid emoji should pass validation without throwing
        assert.doesNotThrow(() => {
            // Using a common emoji character
            emojiSchema.parse('😀');
        }, 'Valid emoji should not throw');

        // An invalid (non‑emoji) string should cause a validation error
        assert.throws(() => {
            emojiSchema.parse('not-an-emoji');
        }, /Invalid/, 'Non‑emoji should throw a validation error');

        done();
    });
});
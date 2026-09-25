let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.emoji', function(done) {
        // Create a basic emoji schema
        const emojiSchema = zod.z.emoji();

        // Should accept a valid emoji
        assert.doesNotThrow(() => {
            emojiSchema.parse('😀');
        }, 'Valid emoji string threw an error');

        // Should reject a non‑emoji string
        assert.throws(() => {
            emojiSchema.parse('hello');
        }, /Invalid/, 'Non‑emoji string did not throw an error');

        // Create a schema with a custom error message
        const customMsgSchema = zod.z.emoji({ message: 'Only emojis allowed' });

        // Verify that the custom message appears in the error
        try {
            customMsgSchema.parse('123');
        } catch (e) {
            assert.ok(e.errors.some(err => err.message === 'Only emojis allowed'), 
                'Custom error message was not present');
        }

        done();
    });
});
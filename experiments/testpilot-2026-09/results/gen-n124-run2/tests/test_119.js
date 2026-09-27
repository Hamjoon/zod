let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.emoji', function(done) {
        const schema = zod.string().emoji();

        // Valid single emoji
        const validSingle = schema.safeParse('😀');
        assert.strictEqual(validSingle.success, true);

        // Invalid non‑emoji string
        const invalidNonEmoji = schema.safeParse('hello');
        assert.strictEqual(invalidNonEmoji.success, false);

        // Valid multiple emojis
        const validMultiple = schema.safeParse('😀😃😄');
        assert.strictEqual(validMultiple.success, true);

        // Invalid mixed content (emoji + non‑emoji)
        const invalidMixed = schema.safeParse('😀a');
        assert.strictEqual(invalidMixed.success, false);

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.trim', function(done) {
        // Create a string schema with .trim()
        const schema = zod.z.string().trim();

        // Should trim leading and trailing whitespace
        const input = '   hello world   ';
        const trimmed = schema.parse(input);
        assert.strictEqual(trimmed, 'hello world');

        // Should leave an already‑trimmed string unchanged
        const alreadyTrimmed = 'foo';
        assert.strictEqual(schema.parse(alreadyTrimmed), 'foo');

        // Should reject non‑string inputs
        assert.throws(() => schema.parse(123), /Expected string/);

        done();
    });
});
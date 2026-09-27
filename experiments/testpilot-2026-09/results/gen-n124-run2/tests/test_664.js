let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.includes', function(done) {
        // Basic includes test
        const schema = zod.z.string().includes('foo');
        // Should pass when the substring is present
        assert.doesNotThrow(() => schema.parse('hello foo world'));
        // Should fail when the substring is absent
        assert.throws(() => schema.parse('hello world'), zod.ZodError);

        // Includes with position parameter
        const schemaWithPos = zod.z.string().includes('bar', { position: 5 });
        // Passes when "bar" starts at index 5 (0‑based)
        assert.doesNotThrow(() => schemaWithPos.parse('12345bar'));
        // Fails when "bar" appears before the required position
        assert.throws(() => schemaWithPos.parse('bar12345'), zod.ZodError);

        done();
    });
});
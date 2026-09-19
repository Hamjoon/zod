let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.readonly', function(done) {
        // Create an inner schema and wrap it with readonly
        const inner = zod.z.string();
        const readonlySchema = zod.z.readonly(inner);

        // Verify the internal definition
        assert.strictEqual(readonlySchema._def.type, 'readonly', 'Definition type should be "readonly"');
        assert.strictEqual(readonlySchema._def.innerType, inner, 'Inner type should be preserved');

        // Successful parse should return the original value
        const parsed = readonlySchema.parse('hello world');
        assert.strictEqual(parsed, 'hello world', 'Parsed value should match input');

        // Parsing an invalid value should throw a ZodError
        assert.throws(() => {
            readonlySchema.parse(123);
        }, zod.ZodError, 'Parsing a non‑string should throw a ZodError');

        done();
    });
});
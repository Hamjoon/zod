let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.strictObject', function(done) {
        // Create a strict object schema with a single required string property
        const schema = zod.z.strictObject({ name: zod.z.string() });

        // ✅ Valid object should parse correctly
        const parsed = schema.parse({ name: "Alice" });
        assert.deepStrictEqual(parsed, { name: "Alice" });

        // ❌ Object with an extra key should throw a ZodError
        assert.throws(() => {
            schema.parse({ name: "Alice", extra: true });
        }, (err) => {
            // Ensure the thrown error is a ZodError (strict mode violation)
            return err instanceof zod.ZodError;
        });

        done();
    });
});
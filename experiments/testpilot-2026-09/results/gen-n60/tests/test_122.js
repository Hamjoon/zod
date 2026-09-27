let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nullable', function(done) {
        // Create an inner schema (string)
        const inner = zod.z.string();

        // Create a nullable version of the inner schema
        const nullable = zod.z.nullable(inner);

        // The nullable schema should accept `null`
        assert.strictEqual(nullable.safeParse(null).success, true);

        // It should also accept values that match the inner schema
        assert.strictEqual(nullable.safeParse('hello world').success, true);

        // It should reject values that do not match the inner schema nor are null
        assert.strictEqual(nullable.safeParse(42).success, false);

        // Verify the internal definition reflects a nullable type with the correct inner type
        assert.strictEqual(nullable._def.type, 'nullable');
        assert.strictEqual(nullable._def.innerType, inner);

        done();
    });
});
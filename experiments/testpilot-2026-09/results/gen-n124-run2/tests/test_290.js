let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.void', function(done) {
        // Create a void schema (expects undefined)
        const voidSchema = zod.z.void();

        // ✅ Should succeed when parsing undefined
        const successResult = voidSchema.safeParse(undefined);
        assert.strictEqual(successResult.success, true, 'void schema should accept undefined');

        // ❌ Should fail for any other value (e.g., null)
        const failResult = voidSchema.safeParse(null);
        assert.strictEqual(failResult.success, false, 'void schema should reject non‑undefined values');

        // The parse method should throw on invalid input
        assert.throws(() => voidSchema.parse(null), /void/, 'parse should throw for invalid values');

        done();
    });
});
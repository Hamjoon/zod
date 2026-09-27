let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.null', function(done) {
        // Create a null schema using the exported helper
        const nullSchema = zod.z.null();

        // 1. Valid case – parsing null should succeed and return null
        assert.strictEqual(nullSchema.parse(null), null, 'null should be parsed correctly');

        // 2. Invalid case – parsing any other value should throw
        assert.throws(() => nullSchema.parse(undefined), /required|invalid/i, 'undefined should not be accepted');
        assert.throws(() => nullSchema.parse(123), /required|invalid/i, 'non‑null values should not be accepted');

        // 3. safeParse – success branch
        const ok = nullSchema.safeParse(null);
        assert.strictEqual(ok.success, true, 'safeParse should succeed for null');
        assert.strictEqual(ok.data, null, 'safeParse data should be null');

        // 4. safeParse – failure branch
        const fail = nullSchema.safeParse('string');
        assert.strictEqual(fail.success, false, 'safeParse should fail for non‑null values');

        done();
    });
});
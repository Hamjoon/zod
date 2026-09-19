let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.preprocess', function(done) {
        // Preprocess: convert input to a number, then validate as a number
        const schema = zod.z.preprocess((val) => Number(val), zod.z.number());

        // Valid case: string "42" should become number 42
        const result = schema.safeParse("42");
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.data, 42);

        // Invalid case: non‑numeric string should fail validation
        const result2 = schema.safeParse("abc");
        assert.strictEqual(result2.success, false);

        done();
    });
});
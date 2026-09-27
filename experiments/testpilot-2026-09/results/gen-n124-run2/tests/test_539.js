let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.lte', function(done) {
        // Should return true when the value is less than or equal to the limit
        assert.strictEqual(zod.z.lte(3, 5), true, '3 <= 5 should be true');
        assert.strictEqual(zod.z.lte(5, 5), true, '5 <= 5 should be true');

        // Should return false when the value exceeds the limit
        assert.strictEqual(zod.z.lte(7, 5), false, '7 <= 5 should be false');

        // Edge cases: non‑numeric inputs should be handled gracefully (return false)
        assert.strictEqual(zod.z.lte('a', 5), false, 'non‑numeric value should be false');
        assert.strictEqual(zod.z.lte(5, 'b'), false, 'non‑numeric limit should be false');

        done();
    });
});
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uint64', function(done) {
        const schema = zod.z.uint64();

        // valid values should pass
        assert.strictEqual(schema.parse(0n), 0n);
        const max = 18446744073709551615n; // 2^64‑1
        assert.strictEqual(schema.parse(max), max);

        // negative values should fail
        assert.throws(() => schema.parse(-1n));

        // values greater than max should fail
        assert.throws(() => schema.parse(max + 1n));

        // non‑BigInt values should fail
        assert.throws(() => schema.parse(123));

        done();
    });
});